<template>
  <nav row justify-center>
    <v-overlay :value="drawer" z-index="4"> </v-overlay>
    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
      temporary
      hide-overlay
      right
      :style="{ top: $vuetify.application.top + 'px', zIndex: 6 }"
    >
      <v-list dense>
        <v-list-item router to="/actividades"> Actividades </v-list-item>
        <v-list-item router to="/user"> Datos Personales <!--<v-icon right>manage_accounts</v-icon>--></v-list-item> 
        <v-list-item v-if="showAdminBoard" router to="/admin">
           Administración <!--<v-icon right>verified</v-icon> -->
        </v-list-item>
        <v-list-item @click.prevent="logOut">
          LogOut 
          <!-- <font-awesome-icon right icon="sign-out-alt" /> -->
          <v-icon right>logout</v-icon>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left dark color="#447fa6">
      
      <v-app-bar-title>
        <v-btn dark color="#447fa6" router to="/profile">
          <span class="font-weight-light">TFG</span> <span>GYM</span></v-btn
        >
      </v-app-bar-title>
      <v-spacer></v-spacer>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    </v-app-bar>
  </nav>
</template>

<script>
export default {
  name: "HeaderLogIn",
  data() {
    return {
      drawer: false,
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    showAdminBoard() {
      if (this.currentUser && this.currentUser.roles) {
        return this.currentUser.roles.includes("ROLE_ADMIN");
      }

      return false;
    },
  },
  methods: {
    logOut() {
      this.$store.dispatch("auth/logout");
      this.$router.push("/log-in");
    },
  },
};
</script>