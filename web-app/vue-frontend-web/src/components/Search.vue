<template>
  <div>
    <v-container v-if="actividadList">
      <h4>Actividades encontradas con tu búsqueda: {{ searchString }}</h4>
      <v-form>
        <v-text-field
          v-model="searchString"
          append-icon="search"
          label="Search"
          single-line
          hide-details
          @keydown.enter="goSearch()"
          @click:append="goSearch()"
        ></v-text-field>
      </v-form>
      <hr />
      <v-card v-for="actividad in actividadList" :key="actividad._id">
        <v-container fill-height fluid>
          <v-layout fill-height>
            <v-flex xs12 align-end flexbox>
              <span class="headline">{{ actividad.nombre }}:</span>
              <p class="grey--text">
                {{ actividad.descripcion }}
              </p>
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-text>
          <p>Monitor: {{ actividad.monitor }}</p>
          {{ actividad.horario }}/{{ actividad.dias }}</v-card-text
        >
        <v-card-actions class="blue-grey darken-1">
          <v-btn
            class="primary"
            router
            :to="{ name: 'actividad', params: { id: actividad._id } }"
            >Leer más</v-btn
          >
          <!-- <v-btn
            class="error"
            v-if="currentUserIsAdmin"
            @click="deleteActividad(actividad._id)"
          >
            Delete actividad
          </v-btn> -->
          <v-btn
            class="error"
            v-if="currentUserIsAdmin"
            @click.stop="dialogEvent(actividad._id)"
          >
            Borrar actividad
            <v-icon right>delete_forever</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-icon class="white--text">sports_handball</v-icon>
        </v-card-actions>
        <p></p>
      </v-card>
      <br />
    </v-container>
    <v-container v-else>
      <h2>
        No hay actividades que coincidan con tu búsqueda: {{ searchString }} ...
      </h2>
      <v-form>
        <v-text-field
          v-model="searchString"
          append-icon="search"
          label="Search"
          single-line
          hide-details
          @keydown.enter="goSearch()"
          @click:append="goSearch()"
        ></v-text-field>
      </v-form>
      <hr />
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
          <v-btn color="error" @click="deleteActividad(id)"> Sí </v-btn>
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
import ActividadService from "../services/actividad.service";
import swal from "sweetalert";

export default {
  name: "Search",
  data() {
    return {
      content: "",
      successful: false,
      actividadList: Array,
      searchString: null,
      dialog: false,
      id: "",
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
    this.searchString = this.$route.params.searchString;
    ActividadService.getActividadesBySearch(this.searchString).then(
      (response) => {
        this.actividadList = response.data.acts;
      },
      (error) => {
        this.content =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();
        this.actividadList = null;
      }
    );
  },
  methods: {
    deleteActividad(id) {
      this.dialog = false;
      ActividadService.deleteActividad(id).then(
        (response) => {
          console.log(response.data);
          this.content = response.data.message;  
          this.successful = true;
          ActividadService.getActividadesBySearch(this.searchString).then(
            (response) => {
              this.actividadList = response.data.acts;
            },
            (error) => {
              this.content =
                (error.response && error.response.data) ||
                error.message ||
                error.toString();
              this.actividadList = null;
            }
          );
          swal("¡Actividad borrada correctamente!", this.content, "success");
        },
        (error) => {
          this.content =
            (error.response && error.response.data) ||
            error.message ||
            error.toString();
          this.successful = false;
          swal(
            "¡Error al borrar Actividad!",
            error.response.data.message.toString(),
            "error"
          );
        }
      );
    },
    goSearch() {
      this.$router.push("/redirect/" + this.searchString);
    },
    atras() {
      this.$router.push("/actividades");
    },
    dialogEvent(actId) {
      this.dialog = true;
      this.id = actId;
    },
  },
};
</script>>