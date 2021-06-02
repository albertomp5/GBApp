<template>
  <div>
    <v-container class="display-1 mb-3"
      >Reseñas:
      <p class="caption grey--text" v-if="reseñaList.length === 0">
        No hay reseñas.
      </p>
    </v-container>
    <v-container class="my-5">
      <v-card
        flat
        tile
        class="px-3"
        v-for="reseña in reseñaList"
        :key="reseña._id"
      >
        <v-row>
          <v-col cols="12" md="6" class="pl-3">
            <div class="caption grey--text">Usuario:</div>
            <div>
              {{ reseña.authorname }} {{ reseña.authorsurname }} -
              {{ reseña.authoremail }}
            </div>
          </v-col>
          <v-col xs="2">
            <div class="caption grey--text">Reseña:</div>
            <div>{{ reseña.reseña.descripcion }}</div>
          </v-col>
          <v-col xs="2">
            <div class="caption grey--text">Votos:</div>
            <div class="caption grey--text">
              <v-icon @click="votarReseña(1, reseña.reseña._id)"
                >thumb_up_off_alt </v-icon
              >{{reseña.contadorFavor}}
              -
              <v-icon @click="votarReseña(2, reseña.reseña._id)"
                >thumb_down_off_alt </v-icon
              >{{reseña.contadorContra}}
            </div>
          </v-col>
          <v-col xs="2">
            <v-btn
              class="error"
              @click="deleteReseña(reseña.reseña._id)"
              v-if="
                currentUserWroteReseña(reseña.reseña.usuario) ||
                currentUserIsAdmin
              "
            >
              Borrar reseña
            </v-btn>
          </v-col>
        </v-row>
        <v-divider></v-divider>
      </v-card>
    </v-container>
    <hr />

    <v-container fill-height=""
      ><v-layout align-center="" justify-center=""
        ><v-flex class="login-form text-xs-center">
          <div class="display-1 mb-3">Danos tu opinión:</div>
          <v-card light=""
            ><v-card-text>
              <v-form>
                <v-textarea
                  label="Descripción"
                  light=""
                  name="descripcion"
                  prepend-icon="description"
                  type="text"
                  v-model="descripcion"
                  autocomplete="on"
                  v-validate="'required'"
                >
                </v-textarea>
                <div
                  v-if="submitted && errors.has('descripcion')"
                  class="alert-danger"
                >
                  {{ errors.first("descripcion") }}
                </div>
                <v-btn @click="saveReseña()" class="primary">
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
        </v-flex></v-layout
      ></v-container
    >
  </div>
</template>

<script>
import ActividadService from "../services/actividad.service";
import swal from "sweetalert";

export default {
  name: "Reseña",
  data() {
    return {
      content: "",
      reseñaList: Array,
      descripcion: "",
      userdata: {
        nombre: "",
        apellidos: "",
        email: "",
      },
      submitted: false,
      successful: false,
    };
  },
  props: {
    actID: String,
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
    ActividadService.getReseñaList(this.actID).then(
      (response) => {
        this.reseñaList = response.data;
        console.log(response);
      },
      (error) => {
        this.content =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();
      }
    );
  },
  methods: {
    deleteReseña(id) {
      ActividadService.deleteReseña(id).then(
        (response) => {
          this.content = response.data.message;
          console.log(response.data);
          this.successful = true;
          ActividadService.getReseñaList(this.actID).then(
            (response) => {
              this.reseñaList = response.data;
              console.log(response);
            },
            (error) => {
              this.content =
                (error.response && error.response.data) ||
                error.message ||
                error.toString();
            }
          );
          swal("¡Reseña borrada!", this.content, "success");
        },
        (error) => {
          this.content =
            (error.response && error.response.data) ||
            error.message ||
            error.toString();
          this.successful = false;
          swal("¡Error al borrar Reseña!", error.response.data.message.toString(), "error");
        }
      );
    },
    saveReseña() {
      this.submitted = true;
      this.$validator.validate().then((isValid) => {
        if (isValid) {
          this.validateBeforeSubmit();
          ActividadService.createReseña(
            this.descripcion,
            this.currentUser.id,
            this.actID
          ).then(
            (response) => {
              console.log(response);
              this.descripcion = undefined;
              this.submitted = false;
              this.content = response.data.message;
              this.successful = true;
              ActividadService.getReseñaList(this.actID).then(
                (response) => {
                  this.reseñaList = response.data;
                  console.log(response);
                },
                (error) => {
                  this.content =
                    (error.response && error.response.data) ||
                    error.message ||
                    error.toString();
                }
              );
              swal("!Reseña creada!", this.content, "success");
            },
            (error) => {
              this.content =
                (error.response && error.response.data) ||
                error.message ||
                error.toString();
              this.successful = false;
              swal("Error al crear Reseña!", error.response.data.message, "error");
            }
          );
        }
      });
    },
    validateBeforeSubmit() {
      this.$validator
        .validateAll()
        .then(function (response) {
          // Validation success if response === true
          //content = response.data;
          console.log("res:" + response);
        })
        .catch(function (e) {
          console.log("error:" + e);
        });
    },
    currentUserWroteReseña(id) {
      if (this.currentUser.id == id) {
        return true;
      }
      return false;
    },
    votarReseña(voto, resID) {
      var vContra;
      var vFavor;

      if (voto === 1) {
        vFavor = true;
        vContra = false;
      }
      if (voto === 2) {
        vFavor = false;
        vContra = true;
      }

      ActividadService.updateReseñaVotos(
        resID,
        this.currentUser.id,
        vContra,
        vFavor
      ).then(
        (response) => {
          console.log(response);
          ActividadService.getReseñaList(this.actID).then(
            (response) => {
              this.reseñaList = response.data;
              console.log(response);
            },
            (error) => {
              this.content =
                (error.response && error.response.data) ||
                error.message ||
                error.toString();
            }
          );
        },
        (error) => {
          this.content =
            (error.response && error.response.data) ||
            error.message ||
            error.toString();
        }
      );
    },
  },
};
</script>