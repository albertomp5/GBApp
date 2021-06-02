<template>
  <div>
    <v-container class="my-5">
      <p class="display-1 mb-3">Día: {{ date }}</p>
      <v-card flat tile class="px-3" v-for="hora in horas" :key="hora.hora">
        <v-row>
          <v-col cols="12" md="6" class="pl-3">
            <div class="caption grey--text">Hora:</div>
            <div>
              {{ hora.hora }}
            </div>
          </v-col>
          <v-col xs="2">
            <v-btn
              class="accent"
              @click="handleReservarHora(hora.hora)"
              :disabled="
                (hora.reserva &&
                  hora.reserva.actualBooks === hora.reserva.maxBooks) ||
                currentDateIsNotCorrect
              "
              >Reservar hora</v-btn
            >
            <div class="caption grey--text" v-if="hora.reserva != null">
              NºReservas:{{ hora.reserva.actualBooks }} AforoMáximo:{{
                hora.reserva.maxBooks
              }}
            </div>
          </v-col>
        </v-row>
        <v-divider></v-divider>
      </v-card>
    </v-container>
    <v-layout justify-center style="position: relative">
      <v-btn class="primary" @click="atras()">atrás</v-btn>
    </v-layout>
    <hr />
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
  name: "GymDay",
  data() {
    return {
      horas: [
        { hora: "9:00", reserva: null },
        { hora: "10:00", reserva: null },
        { hora: "11:00", reserva: null },
        { hora: "12:00", reserva: null },
        { hora: "13:00", reserva: null },
        { hora: "14:00", reserva: null },
        { hora: "15:00", reserva: null },
        { hora: "16:00", reserva: null },
        { hora: "17:00", reserva: null },
        { hora: "18:00", reserva: null },
        { hora: "19:00", reserva: null },
        { hora: "20:00", reserva: null },
        { hora: "21:00", reserva: null },
      ],
      content: "",
      date: String,
      successful: false,
      bookingList: Array,
    };
  },
  props: {
    day: String,
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
    currentDateIsNotCorrect() {
      var d = new Date();
      //var horaActual = d.getHours();
      var diaActual = d.getUTCDate();
      var mesActual = d.getUTCMonth() + 1;
      var añoActual = d.getUTCFullYear();
      var bookingDay = this.date.toString();
      var dateSplits = bookingDay.split("/");
      var daySplit = dateSplits[0];
      var monthSplit = dateSplits[1];
      var yearSplit = dateSplits[2];
      //&&
      //horaActual >= bookingHourSplit
      if (
        diaActual > daySplit &&
        mesActual == monthSplit &&
        añoActual == yearSplit
      ) {
        return true;
      }
      if (
        (diaActual > daySplit &&
        mesActual == monthSplit &&
        añoActual == yearSplit) ||
        mesActual > monthSplit ||
        añoActual > yearSplit
      ) {
        return true;
      }

      if (mesActual != monthSplit) {
        return true;
      }

      if (añoActual != yearSplit) {
        return true;
      }

      return false;
    },
  },
  mounted() {
    var dateSplits = this.day.split("-");
    var daySplit = dateSplits[0];
    var monthSplit = dateSplits[1];
    var yearSplit = dateSplits[2];
    this.date = daySplit + "/" + monthSplit + "/" + yearSplit;
    console.log(this.day);
    console.log(this.date);
    GymService.getAllBookingsInThisDay(this.date).then(
      (response) => {
        this.bookingList = response.data.bookings;
        this.bookingList.forEach((booking) => {
          this.horas.forEach((hora) => {
            if (booking.hora === hora.hora) {
              hora.reserva = booking;
            }
          });
        });
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
    handleReservarHora(hora) {
      GymService.createBooking(this.date, hora, this.currentUser.id).then(
        (response) => {
          console.log(response);
          this.content = response.data.message;
          swal("¡Reserva regitrada!", this.content, "success");
          this.successful = true;
          GymService.getAllBookingsInThisDay(this.date).then(
            (response) => {
              this.bookingList = response.data.bookings;
              this.bookingList.forEach((booking) => {
                this.horas.forEach((hora) => {
                  if (booking.hora === hora.hora) {
                    hora.reserva = booking;
                  }
                });
              });
            },
            (error) => {
              this.content =
                (error.response && error.response.data) ||
                error.message ||
                error.toString();
            }
          );
        },
        (error) => {
          this.content =
            (error.response && error.response.data) ||
            error.message ||
            error.toString();
          this.successful = false;
          swal("¡Error al reservar!", error.response.data.message.toString(), "error");
        }
      );
    },
  },
};
</script>>