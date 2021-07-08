<template>
  <nav row justify-center>
    <v-overlay :value="drawer" z-index="4"> </v-overlay>
    <v-app-bar flat app clipped-left dark color="#447fa6">
      <v-app-bar-title>
        <v-btn dark color="#447fa6" router to="/home">
          <span>GBA</span> <span class="font-weight-light">pp</span></v-btn
        >
      </v-app-bar-title>
      <v-spacer></v-spacer>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      app
      temporary
      clipped
      right
      hide-overlay
      :style="{ top: $vuetify.application.top + 'px', zIndex: 6 }"
    >
      <v-list dense>
        <v-list-item router to="/sobre-nosotros"> Sobre Nosotros </v-list-item>
        <v-list-item router to="/ubicacion"> Ubicación </v-list-item>
        <v-list-item router to="/matriculas"> Matrículas </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script>
export default {
  name: "HeaderLogOut",
  data() {
    return {
      drawer: false,
    };
  },
};
</script>

