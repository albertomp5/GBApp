<template>
  <v-container
    ><v-container fill-height=""
      ><v-layout align-center="" justify-center=""
        ><v-flex class="login-form text-xs-center">
          <div class="display-1 mb-3">Actualiza tus datos:</div>
          <v-card light=""
            ><v-card-text>
              <v-form>
                <div>
                  <strong>Peso:</strong>
                  {{ userData.peso }}
                  <label v-if="!userData.peso">No hay datos.</label>
                  <v-text-field
                    label="Peso"
                    light=""
                    name="peso"
                    prepend-icon="person"
                    type="text"
                    v-model="userData.peso"
                    autocomplete="on"
                    v-validate="'numeric'"
                  ></v-text-field>
                  <div
                    v-if="submitted && errors.has('peso')"
                    class="alert-danger"
                  >
                    {{ errors.first("peso") }}
                  </div>
                </div>
                <div>
                  <strong>Altura:</strong>
                  {{ userData.altura }}
                  <label v-if="!userData.altura">No hay datos.</label>
                  <v-text-field
                    label="Altura"
                    light=""
                    name="altura"
                    prepend-icon="person"
                    type="text"
                    v-model="userData.altura"
                    autocomplete="on"
                    v-validate="'decimal:2'"
                  ></v-text-field>
                  <div
                    v-if="submitted && errors.has('altura')"
                    class="alert-danger"
                  >
                    {{ errors.first("altura") }}
                  </div>
                </div>
                <p>
                  <strong>IMC:</strong>
                  {{ userData.imc }}
                  <label v-if="!userData.imc">No hay datos.</label>
                </p>
                <v-btn @click="handleUpdateUserData()" class="primary">
                  <span>Enviar</span>
                  <v-icon right>touch_app</v-icon>
                </v-btn>
                <!-- <div
                  v-if="content"
                  class="alert"
                  :class="successful ? 'alert-success' : 'alert-danger'"
                >
                  {{ content }}
                </div> -->
              </v-form></v-card-text
            ></v-card
          >
        </v-flex>
      </v-layout>
    </v-container>
    <UploadFiles></UploadFiles>
  </v-container>
</template>

<script>
import UserService from "../services/user.service";
import UploadFiles from "./UploadFiles.vue";
import swal from "sweetalert";

export default {
  name: "User",
  components: {
    UploadFiles,
  },
  data() {
    return {
      content: "",
      submitted: false,
      successful: false,
      userData: {
        peso: "",
        altura: "",
        imc: "",
      },
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  mounted() {
    UserService.getUserBoard().then(
      (response) => {
        console.log(response);
        this.successful = true;
      },
      (error) => {
        this.content =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();
        this.successful = false;
      }
    );

    UserService.getUserData(this.currentUser.id).then(
      (response) => {
        this.userData = response.data.userData;
        this.content = response.data.message;
        this.successful = true;
      },
      (error) => {
        this.content =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();
        this.successful = false;
      }
    );
  },
  methods: {
    handleUpdateUserData() {
      this.submitted = true;
      if (!this.errors.items.length > 0) {
        this.userData.imc = this.userData.peso / this.userData.altura;
        UserService.updateUserData(this.currentUser.id, this.userData).then(
          (response) => {
            console.log(response);
            this.content = response.message;
            this.successful = true;
            swal("¡Datos actualizados!", this.content, "success");
          },
          (error) => {
            this.content =
              (error.response && error.response.data) ||
              error.message ||
              error.toString();
            this.successful = false;
            swal(
              "¡Error al actualizar datos personales!",
              error.response.data.message.toString(),
              "error"
            );
          }
        );
      } else {
        console.log(this.errors);
      }
    },
  },
};
</script>