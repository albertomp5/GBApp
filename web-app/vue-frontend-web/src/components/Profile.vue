<template>
  <v-container justify-center>
    <div class="display-1 mb-3">
      <strong>Bienvenido: {{ currentUser.nombre }}.</strong>
    </div>
    <p class="display-1 mb-3">Haga su reserva:</p>
    <v-container>
      <router-link to="/gym" class="btn">
        <v-img
          :src="require('../assets/gym.jpg')"
          class="my-3"
          contain
          height="200"
          width="250"
          alt="GYM"
        />Gym</router-link
      >
      <router-link to="/padel" class="btn">
        <v-img
          :src="require('../assets/padel.jpg')"
          class="my-3"
          contain
          height="200"
          width="250"
          alt="PÁDEL"
        />Pádel</router-link
      >
    </v-container>
    <PagarMatricula></PagarMatricula>
  </v-container>
</template>

<script>
import PagarMatricula from "./PagarMatricula.vue";

export default {
  name: "Profile",
  components: {
    PagarMatricula,
  },
  data() {
    return {};
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  mounted() {
    if (!this.currentUser) {
      this.$router.push("/log-in");
    }
  },
  methods: {},
};
</script>