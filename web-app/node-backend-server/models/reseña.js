'use strict'

const mongoose = require("mongoose");

const Reseña = mongoose.model(
  "Reseña",
  new mongoose.Schema({
    descripcion: String,
    //votosFavor: Number,       //mirar como implementar para q un usuario solo pueda votar una vez
    //votosContra: Number,
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario"
    },
    actividad: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Actividad"
    }
  })
);

module.exports = Reseña;