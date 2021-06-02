<template>
  <v-container fill-height=""
    ><v-layout align-center="" justify-center=""
      ><v-flex class="login-form text-xs-center">
        <div class="display-1 mb-3">Introduzca su nueva contraseña:</div>
        <v-card light=""
          ><v-card-text>
            <v-form>
              <v-text-field
                label="Password"
                light=""
                name="contraseña"
                prepend-icon="lock"
                type="password"
                v-model="contraseña"
                autocomplete="on"
                v-validate="'required'"
                ref="password"
              >
              </v-text-field>
              <div
                v-if="errors.has('contraseña')"
                class="alert-danger"
                role="alert"
              >
                Password is required!
              </div>
              <v-text-field
                label="Password"
                light=""
                name="repite-contraseña"
                prepend-icon="lock"
                type="password"
                v-model="contraseñaVerificada"
                autocomplete="on"
                v-validate="'required|confirmed:password'"
                data-vv-as="password"
              >
              </v-text-field>
              <div
                v-if="submitted && errors.has('repite-contraseña')"
                class="alert-danger"
              >
                {{ errors.first("repite-contraseña") }}
              </div>
              <v-btn @click="handleResetPassword" class="primary">
                <span>Enviar</span>
                <v-icon right>touch_app</v-icon>
              </v-btn>
              <p></p>
              <v-btn class="accent" router to="/register">Regístrate</v-btn>
              <p>¿No te has registrado todavía?</p>
              <div class="form-group">
                <div v-if="message" class="alert alert-danger" role="alert">
                  {{ message.message }}
                </div>
              </div>
            </v-form></v-card-text
          ></v-card
        >
      </v-flex></v-layout
    ></v-container
  >
</template>

<script>
import AuthService from "../services/auth.service";
import swal from "sweetalert";

export default {
  name: "Reset",
  data() {
    return {
      message: "",
      submitted: false,
      contraseña: "",
      contraseñaVerificada: "",
    };
  },
  props: {
    id: String,
    token: String,
  },
  methods: {
    handleResetPassword() {
      this.submitted = true;
      this.$validator.validateAll().then((isValid) => {
        if (isValid) {
          this.validateBeforeSubmit();
          AuthService.resetPassword(this.id, this.token, this.contraseña).then(
            (response) => {
              console.log(response);
              this.successful = true;
              swal("¡Contraseña reseteada!", "¡Inicie sesión!", "success");
            },
            (error) => {
              console.log(error);
              this.successful = false;
              swal("¡Error!", "¡Error al resetear contraseña!", "error");
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
  },
};
</script>