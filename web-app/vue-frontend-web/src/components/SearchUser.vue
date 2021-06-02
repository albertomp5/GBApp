<template>
  <div>
    <div v-if="userList">
      <v-container class="my-5">
        <h1>Usuarios encontradas con la búsqueda de: {{ searchString }}</h1>
        <v-form>
          <v-text-field
            v-model="searchString"
            append-icon="search"
            label="Search user"
            single-line
            hide-details
            @keydown.enter="goSearch()"
            @click:append="goSearch()"
          ></v-text-field>
        </v-form>
        <hr />
        <v-card flat tile class="px-3" v-for="user in userList" :key="user._id">
          <v-row>
            <v-col cols="12" md="6" class="pl-3">
              <div class="caption grey--text">Usuario:</div>
              <div>
                <router-link
                  :to="{ name: 'user-data', params: { id: user._id } }"
                >
                  {{ user.nombre }}
                  {{ user.apellidos }}
                </router-link>
              </div>
            </v-col>
            <v-col xs="2">
              <div class="caption grey--text">Email:</div>
              <div>
                <router-link
                  :to="{ name: 'user-data', params: { id: user._id } }"
                >
                  {{ user.email }}
                </router-link>
              </div>
            </v-col>
            <v-col xs="2">
              <!-- <v-btn
                v-if="!(currentUser.id === user._id)"
                class="error"
                @click="deleteUser(user._id)"
                >Delete User</v-btn
              > -->
              <v-btn
                v-if="!(currentUser.id === user._id)"
                class="error"
                @click.stop="dialogEvent(user._id)"
              >
                Borrar usuario
                <v-icon right>delete_forever</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-divider></v-divider>
        </v-card>
      </v-container>
    </div>
    <v-container v-else>
      <h2>
        No hay usuarios que coincidan con tu búsqueda: {{ searchString }} ...
        <v-form>
          <v-text-field
            v-model="searchString"
            append-icon="search"
            label="Search user"
            single-line
            hide-details
            @keydown.enter="goSearch()"
            @click:append="goSearch()"
          ></v-text-field>
        </v-form>
        <hr />
      </h2>
    </v-container>
    <v-layout justify-center style="position: relative">
      <v-btn class="accent" @click="atras()">atrás</v-btn>
    </v-layout>
    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="headline"> ¿Estás seguro? </v-card-title>

        <v-card-text> Una vez borrado no hay marcha atrás. </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="primary" @click="dialog = false"> No </v-btn>
          <v-btn color="error" @click="deleteUser(id)"> Sí </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- <div
      v-if="content"
      class="alert"
      :class="successful ? 'alert-success' : 'alert-danger'"
    >
      {{ content.message }}
    </div> -->
  </div>
</template>

<script>
import UserService from "../services/user.service";
import swal from "sweetalert";

export default {
  name: "Search",
  data() {
    return {
      content: "",
      successful: false,
      userList: Array,
      searchString: null,
      id: "",
      dialog: false,
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    currentUserIsAdmin() {
      if (this.currentUser.roles.includes("ROLE_ADMIN")) {
        return true;
      }
      return false;
    },
  },
  mounted() {
    if (!this.currentUserIsAdmin) {
      this.$router.push("/profile");
    }

    this.searchString = this.$route.params.searchString;
    UserService.getUsersBySearch(this.searchString).then(
      (response) => {
        this.userList = response.data.users;
      },
      (error) => {
        this.content =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();

        this.userList = null;
      }
    );
  },
  methods: {
    deleteUser(id) {
      this.dialog = false;
      UserService.deleteUser(id).then(
        (response) => {
          console.log(response.data);
          this.content = response.data;
          this.successful = true;
          UserService.getUsersBySearch(this.searchString).then(
            (response) => {
              this.userList = response.data.users;
            },
            (error) => {
              this.content =
                (error.response && error.response.data) ||
                error.message ||
                error.toString();

              this.userList = null;
            }
          );
          swal("¡Usuario borrado correctamente!", this.content, "success");
        },
        (error) => {
          this.content =
            (error.response && error.response.data) ||
            error.message ||
            error.toString();
          this.successful = false;
          swal(
            "¡Error al borrar Usuario!",
            error.response.data.message.toString(),
            "error"
          );
        }
      );
    },
    goSearch() {
      this.$router.push("/redirect-user/" + this.searchString);
    },
    atras() {
      this.$router.push("/admin");
    },
    dialogEvent(userId) {
      this.dialog = true;
      this.id = userId;
    },
  },
};
</script>>