<template>
  <v-container fill-height=""
    ><v-layout align-center="" justify-center=""
      ><v-flex class="login-form text-xs-center">
        <div class="display-1 mb-3">Introduzca su email:</div>
        <v-card light=""
          ><v-card-text>
            <v-form>
              <v-text-field
                label="Email"
                light=""
                name="email"
                prepend-icon="email"
                type="email"
                v-model="email"
                autocomplete="on"
                v-validate="'required|email|max:50'"
              >
              </v-text-field>
              <div
                v-if="errors.has('email')"
                class="alert alert-danger"
                role="alert"
              >
                Email is required!
              </div>
              <v-btn @click="handleResetPassword" class="primary">
                <span>Enviar</span>
                <v-icon right>touch_app</v-icon>
              </v-btn>
              <p></p>
              <v-btn class="accent" router to="/register">Regístrate</v-btn>
              <p>¿No te has registrado todavía?</p>
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
  name: "Forgot",
  data() {
    return {
      email: "",
    };
  },
  methods: {
    handleResetPassword() {
      this.submitted = true;
      this.$validator.validate().then((isValid) => {
        if (isValid) {
          this.validateBeforeSubmit();
          console.log(this.email);
          AuthService.requestPasswordReset(this.email).then(
            (response) => {
              console.log(response);
              this.successful = true;
              swal("¡Email enviado!", "¡Compruebe su correo!", "success");
            },
            (error) => {
              console.log(error);
              this.successful = false;
              swal("¡Error!", "¡Error resetando contraseña!", "error");
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