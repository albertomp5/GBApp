'use strict'

var mongoose = require('mongoose');

const VotosReseña = mongoose.model(
    'VotosReseña',
    new mongoose.Schema({
        contadorContra: {
            contador: Number,
            usuarios: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Usuario"
                }
            ]
        },
        contadorFavor: {
            contador: Number,
            usuarios: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Usuario"
                }
            ]
        },
        reseña:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Reseña"
        }
    })
);

module.exports = VotosReseña;