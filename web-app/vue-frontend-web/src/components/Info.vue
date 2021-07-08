<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-img
          :src="require('../assets/gbapp1.png')"
          class="my-3"
          contain
          height="200"
        />
      </v-col>

      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">Bienvenido a TFGGYM</h1>
        <p class="subheading font-weight-regular">
          &copy; Desarrollo de una plataforma o aplicación web para la gestión
          de un gimnasio.
        </p>
      </v-col>

      <v-col class="mb-5" cols="12">
        <h2 class="headline font-weight-bold mb-3">Sobre nosotros:</h2>

        <v-row justify="center">
          <v-subheader class="my-15">
            <p>
              "Esta aplicación tiene como objetivo el control de los aforos en los centros deportivos."
            </p>
          </v-subheader>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Info",
};
</script>
