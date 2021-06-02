<template>
  <v-container>
    <p><strong>Usuario:</strong> {{ user.nombre }} {{ user.apellidos }}</p>
    <p><strong>Email:</strong> {{ user.email }}</p>
    <p v-if="!matricula.isPaid"><strong>No ha pagado este mes.</strong></p>
    <p v-if="matricula.isPaid">
      <strong>Matricula pagada. Tipo:</strong> {{ matricula.type }}
    </p>
    <div v-if="bookingGymList.length > 0">
      <strong><p>Reservas pendientes de gym:</p></strong>
      <hr />
      <v-card
        flat
        tile
        class="px-3"
        v-for="booking in bookingGymList"
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
                handleCancelGymBooking(booking._id, booking.date, booking.hora)
              "
            >
              Cancelar Reserva
            </v-btn>
          </v-col>
        </v-row>
        <v-divider></v-divider>
      </v-card>
      <hr />
    </div>
    <div v-if="bookingPadelList.length > 0">
      <strong><p>Reservas pendientes de pádel:</p></strong>
      <hr />
      <v-card
        flat
        tile
        class="px-3"
        v-for="booking in bookingPadelList"
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
                handleCancelPadelBooking(
                  booking._id,
                  booking.date,
                  booking.hora
                )
              "
            >
              Cancelar Reserva
            </v-btn>
          </v-col>
        </v-row>
        <v-divider></v-divider>
      </v-card>
      <hr />
    </div>
    <v-btn class="secondary" @click="hacerAdmin(user._id)"
      >Hacer administrador <v-icon right> star_rate </v-icon></v-btn
    >
    <v-layout justify-center style="position: relative"
      ><v-btn class="accent" @click="atras()">atrás</v-btn></v-layout
    >
    <!-- <div
      v-if="content"
      class="alert"
      :class="successful ? 'alert-success' : 'alert-danger'"
    >
      {{ content }}
    </div> -->
  </v-container>
</template>

<script>
import UserService from "../services/user.service";
import User from "../models/user";
import GymService from "../services/gym.service";
import PadelService from "../services/padel.service";
import swal from "sweetalert";

export default {
  name: "UserData",
  data() {
    return {
      user: new User("", "", "", ""),
      userID: "",
      matricula: {
        isPaid: false,
        type: 0,
      },
      bookingPadelList: Array,
      bookingGymList: Array,
      content: "",
      successful: false,
    };
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
    if (!this.currentUserIsAdmin) {
      this.$router.push("/profile");
    }
    
    UserService.getUser(this.id).then(
      (response) => {
        console.log(response.data);
        this.user.nombre = response.data.user.nombre;
        this.user.apellidos = response.data.user.apellidos;
        this.user.email = response.data.user.email;
        this.userID = response.data.user._id;
        this.content = response.data.message;
        this.successful = true;
        UserService.getMatricula(this.id).then(
          (resp) => {
            this.matricula.isPaid = resp.data.mat.isPaid;
            this.matricula.type = resp.data.mat.type;
          },
          (error) => {
            this.content =
              (error.response && error.response.data) ||
              error.message ||
              error.toString();
            this.successful = false;
          }
        );
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

    PadelService.getAllUserBookings(this.id).then(
      (response) => {
        this.bookingPadelList = response.data.bookings;
      },
      (error) => {
        this.content =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();
      }
    );

    GymService.getAllUserBookings(this.id).then(
      (response) => {
        this.bookingGymList = response.data.bookings;
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
    hacerAdmin() {
      console.log(this.userID);
      UserService.hacerAdmin(this.userID).then(
        (response) => {
          console.log(response);
          this.content = response.data.message;
          this.successful = true;
          swal("¡Usuario es ahora administrador!", this.content, "success");
        },
        (error) => {
          this.content =
            (error.response && error.response.data) ||
            error.message ||
            error.toString();
          this.successful = false;
          swal(
            "¡Error al promover usuario!",
            error.response.data.message.toString(),
            "error"
          );
        }
      );
    },
    atras() {
      this.$router.push("/admin");
    },
    handleCancelGymBooking(ident, date, hora) {
      GymService.cancelBooking(ident, this.id, date, hora).then(
        (response) => {
          console.log(response);
          this.content = response.data.message;
          this.successful = true;
          GymService.getAllUserBookings(this.id).then(
            (response) => {
              this.bookingGymList = response.data.bookings;
            },
            (error) => {
              this.content =
                (error.response && error.response.data) ||
                error.message ||
                error.toString();
            }
          );
          swal("¡Reserva de gimnasio cancelada!", this.content, "success");
        },
        (error) => {
          this.content =
            (error.response && error.response.data) ||
            error.message ||
            error.toString();
          this.successful = false;
          swal(
            "¡Error al cancelar la reserva de gimnasio!",
            error.response.data.message.toString(),
            "error"
          );
        }
      );
    },
    handleCancelPadelBooking(ident, date, hora) {
      PadelService.cancelBooking(ident, this.id, date, hora).then(
        (response) => {
          console.log(response);
          this.content = response.data.message;
          this.successful = true;
          PadelService.getAllUserBookings(this.id).then(
            (response) => {
              this.bookingPadelList = response.data.bookings;
            },
            (error) => {
              this.content =
                (error.response && error.response.data) ||
                error.message ||
                error.toString();
            }
          );
          swal("¡Reserva de padel cancelada!", this.content, "success");
        },
        (error) => {
          this.content =
            (error.response && error.response.data) ||
            error.message ||
            error.toString();
          this.successful = false;
          swal(
            "¡Error al cancelar reserva de padel!",
            error.response.data.message.toString(),
            "error"
          );
        }
      );
    },
  },
};
</script>