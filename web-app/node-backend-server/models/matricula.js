'use strict'

const mongoose = require("mongoose");

const Matricula = mongoose.model(
  "Matricula",
  new mongoose.Schema({
    type: Number,
    isPaid: Boolean,
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario"
    }
  })
);

module.exports = Matricula;