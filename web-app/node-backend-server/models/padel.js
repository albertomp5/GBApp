'use strict'

const mongoose = require("mongoose");

const Padel = mongoose.model(
  "Padel",
  new mongoose.Schema({
    isBookedNow: Boolean,
    horario: String,
  })
);

module.exports = Padel;