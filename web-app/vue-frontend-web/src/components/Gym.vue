<template>
  <div>
    <v-container>
      <p class="display-1 mb-3">GYM</p>
      <p class="grey--text mb-3">Hora actual: {{ gym.horario }}.</p>
      <p class="grey--text mb-3">Aforo actual: {{ gym.aforoActual }}.</p>
      <p class="grey--text mb-3">Máximo aforo: {{ gym.maxAforo }}.</p>
      <FunctionalCalendar
        v-model="calendarData"
        :configs="calendarConfigs"
        @choseDay="choseDay"
      ></FunctionalCalendar
    ></v-container>
    <v-layout justify-center style="position: relative"
      ><v-btn class="accent" @click="goToUserGymBookings"
        >Ver reservas</v-btn
      ></v-layout
    >
    <hr />
    <v-container class="my-5">
      <v-card flat tile class="px-3" v-for="maq in maquinaList" :key="maq._id">
        <v-row>
          <v-col cols="12" md="6" class="pl-3">
            <div class="caption grey--text">Nombre:</div>
            <div>
              {{ maq.nombre }}
            </div>
          </v-col>
          <v-col xs="2">
            <div class="caption grey--text">Ocupada:</div>
            <div>
              {{ maq.estado }}
            </div>
          </v-col>
          <v-col xs="2">
            <v-btn
              v-if="currentUserIsAdmin"
              class="error"
              @click="deleteMaquina(maq._id)"
            >
              Borrar Maquina
            </v-btn>
          </v-col>
        </v-row>
        <v-divider></v-divider>
      </v-card>
    </v-container>
    <hr />
    <v-container v-if="currentUserIsAdmin" fill-height=""
      ><v-layout align-center="" justify-center=""
        ><v-flex class="login-form text-xs-center">
          <div class="display-1 mb-3">Formulario de registro de máquina:</div>
          <v-card light=""
            ><v-card-text>
              <v-form>
                <v-text-field
                  label="Nombre"
                  light=""
                  name="nombre"
                  prepend-icon="person"
                  type="text"
                  v-model="maquinaname"
                  autocomplete="on"
                  v-validate="'required|min:3|max:20'"
                >
                </v-text-field>
                <div
                  v-if="submitted && errors.has('nombre')"
                  class="alert-danger"
                >
                  {{ errors.first("nombre") }}
                </div>
                <v-btn @click="handleCreateMaquina()" class="primary">
                  <span>Registrar</span>
                  <v-icon right>touch_app</v-icon>
                </v-btn>
                <!-- <div
                  v-if="content"
                  class="alert"
                  :class="successful ? 'alert-success' : 'alert-danger'"
                >
                  {{ content }}
                </div> -->
              </v-form></v-card-text
            ></v-card
          >
        </v-flex></v-layout
      ></v-container
    >
  </div>
</template>

<script>
import GymService from "../services/gym.service";
import { FunctionalCalendar } from "vue-functional-calendar";
import swal from "sweetalert";

export default {
  name: "Gym",
  components: {
    FunctionalCalendar,
  },
  data() {
    return {
      content: "",
      successful: false,
      maquinaList: Array,
      maquinaname: "",
      submitted: false,
      gym: {
        aforoActual: null,
        maxAforo: null,
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
        transition: true,
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
    GymService.getGymData().then(
      (response) => {
        console.log(response);
        this.gym.aforoActual = response.data.aforoActual;
        this.gym.maxAforo = response.data.maxAforo;
        this.gym.horario = response.data.horario;
        var horarioSplits = this.gym.horario.split("|");

        GymService.checkUserHasHourBookedNow(this.currentUser.id, horarioSplits[0], horarioSplits[1]).then(
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

    GymService.getMaquinasList().then(
      (response) => {
        this.maquinaList = response.data.maqs;
        console.log(this.maquinaList);
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
    deleteMaquina(id) {
      GymService.deleteMaquina(id).then(
        (response) => {
          console.log(response.data);
          this.content = response.data.message;
          swal("¡Maquina borrada!", this.content, "success");
          this.successful = true;
          GymService.getMaquinasList().then(
            (response) => {
              this.maquinaList = response.data.maqs;
              console.log(this.maquinaList);
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
          swal(
            "¡Error al borrar Maquina!",
            error.response.data.message.toString(),
            "error"
          );
        }
      );
    },
    handleCreateMaquina() {
      this.content = "";
      this.submitted = true;
      this.$validator.validate().then((isValid) => {
        if (isValid) {
          this.validateBeforeSubmit();
          GymService.create(this.maquinaname).then(
            (response) => {
              console.log(response);
              this.content = response.data.message;
              swal("¡Maquina registrada!", this.content, "success");
              this.successful = true;
              GymService.getMaquinasList().then(
                (response) => {
                  this.maquinaList = response.data.maqs;
                  console.log(this.maquinaList);
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
              swal(
                "¡Error al registrar Maquina!",
                error.response.data.message.toString(),
                "error"
              );
            }
          );
        }
      });
    },
    validateBeforeSubmit() {
      this.$validator
        .validateAll()
        .then(function (response) {
          // Validation success if response === true
          console.log("res:" + response);
        })
        .catch(function (e) {
          console.log("error:" + e);
        });
    },
    choseDay(day) {
      this.selectedDate = day;
      var dateSplits = this.selectedDate.date.split("/");
      var daySplit = dateSplits[0];
      var monthSplit = dateSplits[1];
      var yearSplit = dateSplits[2];
      var date = daySplit + "-" + monthSplit + "-" + yearSplit;
      this.$router.push({
        name: "gym-day",
        params: {
          day: date,
        },
      });
    },
    goToUserGymBookings() {
      this.$router.push("/user-gym-bookings");
    },
  },
};
</script>