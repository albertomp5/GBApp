<template>
  <v-container>
    <p class="display-1 mb-3">{{ actividad.nombre }}</p>
    <p class="grey--text mb-3">
      Esta actividad consiste en {{ actividad.descripcion }}
    </p>
    <p class="grey--text mb-3">
      El monitor de esta actividad será {{ actividad.monitor }}.
    </p>
    <p class="grey--text mb-3">
      Días: {{ actividad.dias }}. Horario: {{ actividad.horario }}
    </p>
    <p class="grey--text mb-3">
      Personas apuntadas: {{ actividad.cliApuntados }}. Máximo aforo:
      {{ actividad.maxAforo }}.
    </p>
    <v-btn
      class="accent"
      @click="apuntarse"
      :disabled="actividad.cliApuntados === actividad.maxAforo"
      >Apuntarse <v-icon right>favorite</v-icon></v-btn
    >
    <p></p>
    <v-btn class="error" @click="desapuntarse"
      >Desapuntarse <v-icon right>delete_forever</v-icon></v-btn
    >
    <hr />
    <div class="display-1 mb-3">Imágenes:</div>
    <UploadActividadFiles :actID="id"></UploadActividadFiles>
    <!-- <div
      v-if="content"
      class="alert"
      :class="successful ? 'alert-success' : 'alert-danger'"
    >
      {{ content }}
    </div> -->
    <hr />
    <Reseña :actID="id"></Reseña>
    <hr />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css" integrity="sha256-h20CPZ0QyXlBuAw7A+KluUYx/3pK+c7lYEpqLTlxjYQ=" crossorigin="anonymous" />
    <div class="share-network-list">
      <ShareNetwork
        v-for="network in networks"
        :network="network.network"
        :key="network.network"
        :url="sharing.url"
        :title="sharing.title"
        :style="{ backgroundColor: network.color }"
        :description="sharing.description"
        :quote="sharing.quote"
        :hashtags="sharing.hashtags"
        :twitterUser="sharing.twitterUser"
      >
        <!-- <font-awesome-icon right icon="sign-out-alt" />  -->
        <i :class="network.icon"></i>
        <span class="white--text">{{ network.name }} </span>
      </ShareNetwork>
    </div>
    <hr />
    <v-layout justify-center style="position: relative">
      <v-btn class="accent" @click="atras()">atrás</v-btn>
    </v-layout>
  </v-container>
</template>

<script>
import ActividadService from "../services/actividad.service";
import Actividad from "../models/actividad";
import UploadActividadFiles from "./UploadActividadFiles.vue";
import Reseña from "./Reseña.vue";
import swal from "sweetalert";

export default {
  name: "Actividad",
  data() {
    return {
      actividad: new Actividad(this.id, "", "", "", "", "", "", ""),
      cApuntados: 0,
      content: "",
      successful: false,
      sharing: {
        url: "gbapp.ddns.net",
        title: "Bienvenido a GBApp!",
        description: "",
        quote:
          "Desarrollo de una plataforma o aplicación web para la gestión de un gimnasio.",
        hashtags: "vuejs,javascript,tfg",
        twitterUser: "albertomp55",
      },
      networks: [
        {
          network: "email",
          name: "Email",
          icon: "far fah fa-lg fa-envelope white--text",
          color: "#333333",
        },
        {
          network: "evernote",
          name: "Evernote",
          icon: "fab fah fa-lg fa-evernote white--text",
          color: "#2dbe60",
        },
        {
          network: "facebook",
          name: "Facebook",
          icon: "fab fah fa-lg fa-facebook-f white--text",
          color: "#1877f2",
        },
        {
          network: "line",
          name: "Line",
          icon: "fab fah fa-lg fa-line white--text",
          color: "#00c300",
        },
        {
          network: "linkedin",
          name: "LinkedIn",
          icon: "fab fah fa-lg fa-linkedin white--text",
          color: "#007bb5",
        },
        {
          network: "pinterest",
          name: "Pinterest",
          icon: "fab fah fa-lg fa-pinterest white--text",
          color: "#bd081c",
        },
        {
          network: "reddit",
          name: "Reddit",
          icon: "fab fah fa-lg fa-reddit-alien white--text",
          color: "#ff4500",
        },
        {
          network: "skype",
          name: "Skype",
          icon: "fab fah fa-lg fa-skype white--text",
          color: "#00aff0",
        },
        {
          network: "sms",
          name: "SMS",
          icon: "far fah fa-lg fa-comment-dots white--text",
          color: "#333333",
        },
        {
          network: "telegram",
          name: "Telegram",
          icon: "fab fah fa-lg fa-telegram-plane white--text",
          color: "#0088cc",
        },
        {
          network: "twitter",
          name: "Twitter",
          icon: "fab fah fa-lg fa-twitter white--text",
          color: "#1da1f2",
        },
        {
          network: "whatsapp",
          name: "Whatsapp",
          icon: "fab fah fa-lg fa-whatsapp white--text",
          color: "#25d366",
        },
        {
          network: "wordpress",
          name: "Wordpress",
          icon: "fab fah fa-lg fa-wordpress white--text",
          color: "#21759b",
        },
      ],
    };
  },
  components: {
    UploadActividadFiles,
    Reseña,
  },
  props: {
    id: String,
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
    currentUserIsAdmin() {
      if (this.currentUser.roles.includes("ROLE_ADMIN")) {
        return true;
      }
      return false;
    },
  },
  mounted() {
    ActividadService.getActividad(this.id).then(
      (response) => {
        console.log(response.data);
        this.actividad.nombre = response.data.nombre;
        this.actividad.descripcion = response.data.descripcion;
        this.actividad.horario = response.data.horario;
        this.actividad.dias = response.data.dias;
        this.actividad.monitor = response.data.monitor;
        this.actividad.cliApuntados = response.data.cliApuntados;
        this.actividad.maxAforo = response.data.maxAforo;
        this.actividad.imagenes = response.data.imagenes;
        this.content = response.data.message;
        this.sharing.title =
          "Bienvenido a TFGGYM. Estoy realizando " +
          this.actividad.nombre +
          ". Apúntate aquí!";
        this.sharing.descripcion = this.actividad.descripcion;
        this.successful = true;
      },
      (error) => {
        this.content =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();
        this.successful = false;
        this.$router.push("/profile");
      }
    );
  },
  methods: {
    apuntarse() {
      ActividadService.apuntarActividad(this.id, this.currentUser.id).then(
        (response) => {
          console.log(response.data);
          this.content = response.data.message;
          this.successful = true;
          ActividadService.getActividad(this.id).then(
            (response) => {
              console.log(response.data);
              this.actividad.nombre = response.data.nombre;
              this.actividad.descripcion = response.data.descripcion;
              this.actividad.horario = response.data.horario;
              this.actividad.dias = response.data.dias;
              this.actividad.monitor = response.data.monitor;
              this.actividad.cliApuntados = response.data.cliApuntados;
              this.actividad.maxAforo = response.data.maxAforo;
              this.actividad.imagenes = response.data.imagenes;
              this.content = response.data.message;
              this.successful = true;
            },
            (error) => {
              this.content =
                (error.response && error.response.data) ||
                error.message ||
                error.toString();
              this.successful = false;
            }
          );
          swal("¡Usuario apuntado!", this.content, "success");
        },
        (error) => {
          this.content =
            (error.response && error.response.data) ||
            error.message ||
            error.toString();
          this.successful = false;
          swal(
            "¡Error al apuntarse!",
            error.response.data.message.toString(),
            "error"
          );
        }
      );
    },
    desapuntarse() {
      ActividadService.desapuntarActividad(this.id, this.currentUser.id).then(
        (response) => {
          console.log(response.data);
          this.content = response.data.message;
          this.successful = true;
          ActividadService.getActividad(this.id).then(
            (response) => {
              console.log(response.data);
              this.actividad.nombre = response.data.nombre;
              this.actividad.descripcion = response.data.descripcion;
              this.actividad.horario = response.data.horario;
              this.actividad.dias = response.data.dias;
              this.actividad.monitor = response.data.monitor;
              this.actividad.cliApuntados = response.data.cliApuntados;
              this.actividad.maxAforo = response.data.maxAforo;
              this.actividad.imagenes = response.data.imagenes;
              this.content = response.data.message;
              this.successful = true;
            },
            (error) => {
              this.content =
                (error.response && error.response.data) ||
                error.message ||
                error.toString();
              this.successful = false;
            }
          );
          swal("¡Usuario desapuntado!", this.content, "success");
        },
        (error) => {
          this.content =
            (error.response && error.response.data) ||
            error.message ||
            error.toString();
          this.successful = false;
          swal(
            "¡Error al desapuntarse!",
            error.response.data.message.toString(),
            "error"
          );
        }
      );
    },
    atras() {
      this.$router.push("/actividades");
    },
  },
};
</script>

<style>
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
    Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}
.share-network-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 1000px;
  margin: auto;
}
a[class^="share-network-"] {
  flex: none;
  color: #ffffff;
  background-color: #333;
  border-radius: 3px;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  align-content: center;
  align-items: center;
  cursor: pointer;
  margin: 0 10px 10px 0;
}
a[class^="share-network-"] .fah {
  background-color: rgba(0, 0, 0, 0.2);
  padding: 10px;
  flex: 0 1 auto;
}
a[class^="share-network-"] span {
  padding: 0 10px;
  flex: 1 1 0%;
  font-weight: 500;
}
</style>


