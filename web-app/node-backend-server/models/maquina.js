'use strict'

const mongoose = require("mongoose");

const Maquina = mongoose.model(
  "Maquina",
  new mongoose.Schema({
    estado: Boolean, //libre o ocupada
    nombre: String
  })
);

module.exports = Maquina;