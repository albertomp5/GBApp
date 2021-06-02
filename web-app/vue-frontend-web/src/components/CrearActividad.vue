<template>
  <v-container fill-height=""
    ><v-layout align-center="" justify-center=""
      ><v-flex class="login-form text-xs-center">
        <div class="display-1 mb-3">Formulario de registro de actividad:</div>
        <v-card light=""
          ><v-card-text>
            <v-form>
              <v-text-field
                label="Nombre"
                light=""
                name="nombre"
                prepend-icon="sports_handball"
                type="text"
                v-model="actividad.nombre"
                autocomplete="on"
                v-validate="'required|min:3|max:20'"
              >
              </v-text-field>
              <div
                v-if="submitted && errors.has('nombre')"
                class="alert-danger"
              >
                {{ errors.first("nombre") }}
              </div>
              <v-textarea
                label="Descripción"
                light=""
                name="descripcion"
                prepend-icon="description"
                type="text"
                v-model="actividad.descripcion"
                autocomplete="on"
                v-validate="'required|min:15|max:500'"
              >
              </v-textarea>
              <div
                v-if="submitted && errors.has('descripcion')"
                class="alert-danger"
              >
                {{ errors.first("descripcion") }}
              </div>
              <v-text-field
                label="Horario"
                light=""
                name="horario"
                prepend-icon="date_range"
                type="text"
                v-model="actividad.horario"
                autocomplete="on"
                v-validate="'required'"
              >
              </v-text-field>
              <div
                v-if="submitted && errors.has('horario')"
                class="alert-danger"
              >
                {{ errors.first("horario") }}
              </div>
              <v-text-field
                label="Días (format: Monday, Tuesday, ..., Sunday)"
                light=""
                name="dias"
                prepend-icon="calendar_today"
                type="text"
                v-model="actividad.dias"
                autocomplete="on"
                v-validate="'required|date_format:eeee'"
              >
              </v-text-field>
              <div v-if="submitted && errors.has('dias')" class="alert-danger">
                {{ errors.first("dias") }}
              </div>
              <v-text-field
                label="Monitor"
                light=""
                name="monitor"
                prepend-icon="verified_user"
                type="text"
                v-model="actividad.monitor"
                autocomplete="on"
                v-validate="'required|min:3|max:20'"
              >
              </v-text-field>
              <div
                v-if="submitted && errors.has('monitor')"
                class="alert-danger"
              >
                {{ errors.first("monitor") }}
              </div>
              <v-text-field
                label="Aforo máximo"
                light=""
                name="maxAforo"
                prepend-icon="groups"
                type="text"
                v-model="actividad.maxAforo"
                autocomplete="on"
                v-validate="'required|numeric'"
              >
              </v-text-field>
              <div
                v-if="submitted && errors.has('maxAforo')"
                class="alert-danger"
              >
                {{ errors.first("maxAforo") }}
              </div>
              <v-layout justify-center style="position: relative">
                <v-btn @click="handleCreateActividad()" class="primary">
                  <span>Crear</span>
                  <v-icon right>touch_app</v-icon>
                </v-btn>
                <v-btn class="accent" @click="atras()">atrás</v-btn>
              </v-layout>
              <!-- <div
                  v-if="message"
                  class="alert"
                  :class="successful ? 'alert-success' : 'alert-danger'"
                >
                  {{ message }}
                </div> -->
            </v-form></v-card-text
          ></v-card
        >
      </v-flex></v-layout
    >
  </v-container>
</template>

<script>
import Actividad from "../models/actividad";
import ActividadService from "../services/actividad.service";
import swal from "sweetalert";

export default {
  name: "CrearActividad",
  data() {
    return {
      actividad: new Actividad(null, "", "", "", "", "", "", ""),
      submitted: false,
      successful: false,
      message: "",
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
  },
  methods: {
    handleCreateActividad() {
      this.message = "";
      this.submitted = true;
      this.$validator.validate().then((isValid) => {
        if (isValid) {
          this.validateBeforeSubmit();
          ActividadService.create(this.actividad).then(
            (response) => {
              console.log(response);
              this.actividad.id = response.data.data._id;
              this.message = response.data.message;
              this.successful = true;
              swal("¡Actividad creada!", this.message, "success");
            },
            (error) => {
              this.message =
                (error.response && error.response.data) ||
                error.message ||
                error.toString();
              this.successful = false;
              swal(
                "¡Error al crear actividad!",
                error.response.data.message.toString(),
                "error"
              );
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
          console.log("res:" + response);
        })
        .catch(function (e) {
          console.log("error:" + e);
        });
    },
    atras() {
      this.$router.push("/admin");
    },
  },
};
</script>