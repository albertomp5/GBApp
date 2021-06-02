<template>
  <v-main
    ><v-container fill-height=""
      ><v-layout align-center="" justify-center=""
        ><v-flex class="login-form text-xs-center">
          <div class="display-1 mb-3">Tus datos:</div>
          <v-card light=""
            ><v-card-text>
              <v-form>
                <v-text-field
                  label="Nombre"
                  light=""
                  name="nombre"
                  prepend-icon="person"
                  type="text"
                  v-model="user.nombre"
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
                <v-text-field
                  label="Apellidos"
                  light=""
                  name="apellidos"
                  prepend-icon="person"
                  type="text"
                  v-model="user.apellidos"
                  autocomplete="on"
                  v-validate="'required|min:3|max:50'"
                >
                </v-text-field>
                <div
                  v-if="submitted && errors.has('apellidos')"
                  class="alert-danger"
                >
                  {{ errors.first("apellidos") }}
                </div>
                <v-text-field
                  label="Email"
                  light=""
                  name="email"
                  prepend-icon="email"
                  type="email"
                  v-model="user.email"
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
                <v-text-field
                  label="Password"
                  light=""
                  name="contraseña"
                  prepend-icon="lock"
                  type="password"
                  v-model="user.contraseña"
                  autocomplete="on"
                  v-validate="'required'"
                  ref="password"
                >
                </v-text-field>
                <div
                  v-if="errors.has('contraseña')"
                  class="alert alert-danger"
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
                  v-model="user.contraseñaVerificada"
                  autocomplete="on"
                  v-validate="'required|confirmed:password'"
                  data-vv-as="password"
                  @keydown.enter="handleRegister()"
                >
                </v-text-field>
                <div
                  v-if="submitted && errors.has('repite-contraseña')"
                  class="alert-danger"
                >
                  {{ errors.first("repite-contraseña") }}
                </div>
                <v-btn @click="handleRegister()" class="primary">
                  <span>Regístrate</span>
                  <v-icon right>touch_app</v-icon>
                </v-btn>
                <!-- <p> </p>
                <v-btn class="primary" router to="/log-in">Log in</v-btn>
                <p>¿Ya te has registrado?</p> -->
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
      ></v-container
    ></v-main
  >
</template>

<script>
import User from "../models/user";
import swal from "sweetalert";

export default {
  name: "Register",
  data() {
    return {
      user: new User("", "", "", ""),
      submitted: false,
      successful: false,
      message: "",
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
  },
  mounted() {
    if (this.loggedIn) {
      this.$router.push("/profile");
    }
  },
  methods: {
    handleRegister() {
      this.message = "";
      this.submitted = true;
      this.$validator.validate().then((isValid) => {
        if (isValid) {
          this.validateBeforeSubmit();
          this.$store.dispatch("auth/register", this.user).then(
            (data) => {
              this.message = data.message;
              this.successful = true;
              swal("¡Usuario registrado!", this.message, "success");
            },
            (error) => {
              this.message =
                (error.response && error.response.data) ||
                error.message ||
                error.toString();
              this.successful = false;
              swal("¡Error al registrar!", error.response.data.message.toString(), "error");
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