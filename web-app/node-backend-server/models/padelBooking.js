'use strict'

const mongoose = require("mongoose");

const PadelBooking = mongoose.model(
    "PadelBooking",
    new mongoose.Schema({
        date: String,
        hora: String,
        isBooked: Boolean,
        usuario:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Usuario"
        },
    })
);

module.exports = PadelBooking;