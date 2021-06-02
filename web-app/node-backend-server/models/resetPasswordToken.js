'use strict'

var mongoose = require('mongoose');

const Token = mongoose.model(
    'ResetToken',
    new mongoose.Schema({
        usuario: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Usuario",
        },
        token: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            required: true,
            default: Date.now,
            expires: 3600,
        },
    })
);

module.exports = Token;