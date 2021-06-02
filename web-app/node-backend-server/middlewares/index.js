'use strict'

const authJwt = require("./authJwt");
const verifySignUp = require("./verifySignUp");
const verifyNewActividad = require("./verifyNewActividad");
const verifyMatricula = require("./verifyMatricula");
const verifyBooking = require("./verifyBooking");
const verifyPadelBooking = require("./verifyPadelBooking");

module.exports = {
  authJwt,
  verifySignUp,
  verifyNewActividad,
  verifyMatricula,
  verifyBooking,
  verifyPadelBooking
};