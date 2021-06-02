<template>
  <v-main
    ><v-container fill-height=""
      ><v-layout align-center="" justify-center=""
        ><v-flex class="login-form text-xs-center">
          <div class="display-1 mb-3">Inicia sesión:</div>
          <v-card light=""
            ><v-card-text>
              <v-form>
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
                  @keydown.enter="handleLogin"
                >
                </v-text-field>
                <div
                  v-if="errors.has('contraseña')"
                  class="alert alert-danger"
                  role="alert"
                >
                  Password is required!
                </div>
                <v-btn @click="handleLogin" :disabled="loading" class="primary">
                  <span
                    v-show="loading"
                    class="spinner-border spinner-border-sm"
                  ></span>
                  <span>Inicie sesión</span>
                  <v-icon right>login</v-icon>
                </v-btn>
                <p></p>
                <v-btn class="accent" router to="/register">Regístrate</v-btn>
                <p>¿No te has registrado todavía?</p>
                <p class="forgot-password text-right"><router-link to="/forgot-password">¿Ha olvidado su contraseña?</router-link></p>
                <!-- <div class="form-group">
                  <div v-if="message" class="alert alert-danger" role="alert">
                    {{ message.message }}
                  </div>
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
  name: "LogIn",
  data() {
    return {
      user: new User("", "", "", ""),
      loading: false,
      message: "",
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    },
  },
  created() {
    if (this.loggedIn) {
      this.$router.push("/profile");
    }
  },
  methods: {
    handleLogin() {
      this.loading = true;
      this.$validator.validateAll().then((isValid) => {
        if (!isValid) {
          this.loading = false;
          return;
        }

        if (this.user.email && this.user.contraseña) {
          this.$store.dispatch("auth/login", this.user).then(
            () => {
              this.$router.push("/profile");
            },
            (error) => {
              this.loading = false;
              this.message =
                (error.response && error.response.data) ||
                error.message ||
                error.toString();
              swal("¡Error al inciar sesión!", this.message.message, "error");
            }
          );
        }
      });
    },
  },
};
</script>