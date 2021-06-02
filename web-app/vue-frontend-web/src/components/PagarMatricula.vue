<template>
  <v-container>
    <div v-if="!paidFor">
      <p class="display-1 mb-3">Pague su matricula:</p>
      <v-radio-group v-model="matricula.type" required>
        <v-radio label="Tipo 1" @click="tipoMatricula(1)" value="1"></v-radio>
        <v-radio label="Tipo 2" @click="tipoMatricula(2)" value="2"></v-radio>
        <v-radio label="Tipo 3" @click="tipoMatricula(3)" value="3"></v-radio>
      </v-radio-group>
      <div id="paypal-button-container"></div>
    </div>
    <div v-if="paidFor">
      <p class="grey--text mb-3">Matrícula pagada.</p>
    </div>
    <!-- <div id="paypal-button-container"></div> -->
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
import swal from "sweetalert";
import { loadScript } from "@paypal/paypal-js";

export default {
  name: "PagarMatricula",
  data: function () {
    return {
      content: "",
      successful: false,
      paidFor: false, //comprobar si la tiene pagada
      matricula: {
        price: 0,
        type: 0,
      },
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    },
  },
  mounted() {
    //matricula already paid
    UserService.matriculaPaid(this.currentUser.id).then(
      (response) => {
        console.log(response);
        this.paidFor = true;
        this.successful = true;
      },
      (error) => {
        console.log(error.response);

        this.content =
          (error.response && error.response.data.message) ||
          error.message ||
          error.toString();

        this.paidFor = false;
        this.successful = false;
        loadScript({
          "client-id":
            "AUgwWLH49anFg9YBovD4j-Lrr6HGWOQAFseLnmvp0FEPuk16uVCImKC59rks3Tdfh8hPBDnfhxu5NC8H",
          currency: "EUR",
        })
          .then((paypal) => {
            paypal
              .Buttons({
                createOrder: (data, actions) => {
                  return actions.order.create({
                    purchase_units: [
                      {
                        amount: {
                          value: this.matricula.price,
                        },
                      },
                    ],
                  });
                },
                onApprove: async (data, actions) => {
                  UserService.pagarMatricula(
                    this.currentUser.id,
                    this.matricula
                  ).then(
                    async (response) => {
                      console.log(response);
                      this.content = response.data.message;
                      const order = await actions.order.capture();
                      console.log(data);
                      console.log(order);
                      this.paidFor = true;
                      this.successful = true;
                      swal(
                        "¡Matricula pagada correctamente!",
                        this.content,
                        "success"
                      );
                    },
                    (error) => {
                      this.content =
                        (error.response && error.response.data.message) ||
                        error.message ||
                        error.toString();
                      if (error.response.status == 409) this.paidFor = true;
                      else this.paidFor = false;
                      this.successful = false;
                      swal(
                        "¡Error al pagar Matricula!",
                        error.response.data.message.toString(),
                        "error"
                      );
                    }
                  );
                },
                onError: (err) => {
                  swal(
                    "¡Error al pagar Matricula!",
                    "¡Seleccione el tipo de Matricula!",
                    "error"
                  );
                  console.log(err);
                },
              })
              .render("#paypal-button-container");
          })
          .catch((err) => {
            console.error("failed to load the PayPal JS SDK script", err);
          });
      }
    );
  },
  methods: {
    tipoMatricula(id) {
      switch (id) {
        case 1:
          this.matricula.price = 19.99;
          console.log(this.matricula);
          break;
        case 2:
          this.matricula.price = 29.99;
          console.log(this.matricula);
          break;
        case 3:
          this.matricula.price = 39.99;
          console.log(this.matricula);
          break;
        default:
          swal("¡Error!", "¡Seleccione un tipo de Matricula!", "error");
          break;
      }
    },
  },
};
</script>