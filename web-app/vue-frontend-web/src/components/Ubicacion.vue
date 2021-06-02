<template>
  <v-container>
    <h1 style="text-align: center">Ubicación</h1>
    <GoogleMap
      :latitude="40.962695"
      :longitude="-5.668258"
      :title="'Titulo Marcador'"
    />
  </v-container>
</template>

<script>
import GoogleMap from "./GoogleMap";
export default {
  name: "Ubicacion",
  components: {
    GoogleMap,
  },
};
</script>