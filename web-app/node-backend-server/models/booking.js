'use strict'

const mongoose = require("mongoose");

const Booking = mongoose.model(
    "Booking",
    new mongoose.Schema({
        date: String,
        hora: String,
        actualBooks: Number,
        maxBooks: Number,
        usuarios: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Usuario"
            }
        ],
    })
);

module.exports = Booking;