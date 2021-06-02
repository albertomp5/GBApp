<template>
  <div>
    <v-container>
      <p class="display-1 mb-3">PÁDEL</p>
      <p class="grey--text mb-3">Hora actual: {{ padel.horario }}.</p>
      <p v-if="padel.isBookedNow" class="grey--text mb-3">Pista ocupada.</p>
      <p v-if="!padel.isBookedNow" class="grey--text mb-3">
        Pista libre actualmente.
      </p>
      <FunctionalCalendar
        v-model="calendarData"
        :configs="calendarConfigs"
        @choseDay="choseDay"
      ></FunctionalCalendar
    ></v-container>
    <v-layout justify-center style="position: relative"
      ><v-btn class="accent" @click="goToUserPadelBookings"
        >Ver reservas</v-btn
      ></v-layout
    >
    <!-- <div
      v-if="content"
      class="alert"
      :class="successful ? 'alert-success' : 'alert-danger'"
    >
      {{ content }}
    </div> -->
    <div class="clearfix"></div>
  </div>
</template>

<script>
import PadelService from "../services/padel.service";
import { FunctionalCalendar } from "vue-functional-calendar";
import swal from 'sweetalert';

export default {
  name: "Padel",
  components: {
    FunctionalCalendar,
  },
  data() {
    return {
      content: "",
      successful: false,
      submitted: false,
      padel: {
        isBookedNow: null,
        horario: null,
      },
      selectedDate: null,
      calendarData: {},
      calendarConfigs: {
        sundayStart: false,
        dateFormat: "dd/mm/yyyy",
        isDatePicker: true,
        isMultipleDatePicker: false,
        isDateRange: false,
        changeYearFunction: true,
      },
    };
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
    PadelService.getPadelData().then(
      (response) => {
        console.log(response);
        this.padel.isBookedNow = response.data.isBookedNow;
        this.padel.horario = response.data.horario;
        var horarioSplits = this.padel.horario.split("|");

        PadelService.checkUserHasHourBookedNow(this.currentUser.id, horarioSplits[0], horarioSplits[1]).then(
          (response) => {
            console.log(response);
            swal("¡Hola!", response.data.message, "info");
          },
          (error) => {
            console.log(error);
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
      }
    );
  },
  methods: {
    choseDay(day) {
      this.selectedDate = day;
      var dateSplits = this.selectedDate.date.split("/");
      var daySplit = dateSplits[0];
      var monthSplit = dateSplits[1];
      var yearSplit = dateSplits[2];
      var date = daySplit + "-" + monthSplit + "-" + yearSplit;
      this.$router.push({
        name: "padel-day",
        params: {
          day: date
        },
      });
    },
    goToUserPadelBookings() {
      this.$router.push("/user-padel-bookings");
    },
  },
};
</script>