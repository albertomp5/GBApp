<template>
  <v-app>
    <HeaderLogOut v-if="!this.currentUser"></HeaderLogOut>
    <HeaderLogIn v-if="this.currentUser"></HeaderLogIn>
    <v-main class="grey lighten-3">
      <v-fade-transition mode="out-in">
        <router-view></router-view>
      </v-fade-transition>
    </v-main>
    <v-footer dark color="#447fa6" >
      <span>© 2020/2021 - <a href="https://usal.es" color="#447fa6" class="white--text">USAL</a></span>
    </v-footer>
  </v-app>
</template>

<script>
import HeaderLogOut from "./components/HeaderLogOut.vue";
import HeaderLogIn from "./components/HeaderLogIn.vue";

export default {
  name: "App",
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  components: {
    HeaderLogOut,
    HeaderLogIn,
  },
};
</script>

