'use strict'

const mongoose = require("mongoose");

const Gym = mongoose.model(
    "Gym",
    new mongoose.Schema({
        aforoActual: Number,
        maxAforo: Number,
        horario: String,
        nMaquinas: Number,
        maquinas: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Maquina"
        }]
    })
);

module.exports = Gym;