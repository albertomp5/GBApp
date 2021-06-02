<template>
  <div>
    <v-container class="my-5">
      <h3>Cancelar reservas:</h3>
      <hr/>
      <div v-if="bookingList.length===0" class="caption grey--text">No hay reservas.</div>
      <v-card
        flat
        tile
        class="px-3"
        v-for="booking in bookingList"
        :key="booking._id"
      >
        <v-row>
          <v-col cols="12" md="6" class="pl-3">
            <div class="caption grey--text">Fecha:</div>
            <div>
              {{ booking.date }}
            </div>
          </v-col>
          <v-col xs="2">
            <div class="caption grey--text">Hora:</div>
            <div>{{ booking.hora }}</div>
          </v-col>
          <v-col xs="2">
            <v-btn
              class="error"
              @click="
                handleCancelBooking(booking._id, booking.date, booking.hora)
              "
            >
              Cancelar Reserva
              <v-icon right>delete_forever</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-divider></v-divider>
      </v-card>
      <hr/>
    </v-container>
    <v-layout justify-center style="position: relative;"><v-btn class="accent" @click="atras()">atrás</v-btn></v-layout>
    <!-- <div
      v-if="content"
      class="alert"
      :class="successful ? 'alert-success' : 'alert-danger'"
    >
      {{ content }}
    </div> -->
  </div>
</template>

<script>
import GymService from "../services/gym.service";
import swal from "sweetalert";

export default {
  name: "UserGymBookings",
  data() {
    return { content: "", successful: false, bookingList: Array };
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
    GymService.getAllUserBookings(this.currentUser.id).then(
      (response) => {
        this.bookingList = response.data.bookings;
        console.log(this.bookingList);
      },
      (error) => {
        this.content =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();
      }
    );
  },
  methods: {
    atras() {
      this.$router.push("/gym");
    },
    handleCancelBooking(id, date, hora) {
      GymService.cancelBooking(id, this.currentUser.id, date, hora).then(
        (response) => {
          console.log(response);
          this.content = response.data.message;
          this.successful = true;
          GymService.getAllUserBookings(this.currentUser.id).then(
            (response) => {
              this.bookingList = response.data.bookings;
              console.log(this.bookingList);
            },
            (error) => {
              this.content =
                (error.response && error.response.data) ||
                error.message ||
                error.toString();
            }
          );
          swal("¡Reserva cancelada correctamente!", this.content, "success");
        },
        (error) => {
          this.content =
            (error.response && error.response.data) ||
            error.message ||
            error.toString();
          this.successful = false;
          swal("¡Error al cancelar la reserva!", error.response.data.message.toString(), "error");
        }
      );
    },
  },
};
</script>