'use strict'

var mongoose = require('mongoose');

const Activity = mongoose.model(
  'Actividad',
  new mongoose.Schema({
    nombre: String,
    descripcion: String,
    horario: String,
    dias: String,
    imagenes: [String], //File
    monitor: String,
    maxAforo: Number,
    cliApuntados: Number,
    reseñas: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reseña"
      }
    ],
    usuarios: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario"
      }
    ]
  })
);

module.exports = Activity;