'use strict'

const dbConfig = require("../config/db.config.js");
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;
db.url = dbConfig.url;

//usuarios
db.user = require("./usuario");
db.resettoken = require("./resetPasswordToken");
db.role = require("./role");
db.matricula = require("./matricula");

//actividades
db.actividad = require("./actividad");
db.reseña = require("./reseña");
db.votosReseña = require("./votosReseña");

//centro deportivo
db.maquina = require("./maquina");
db.gym = require("./gym");
db.padel = require("./padel");
db.booking = require("./booking");
db.padelbooking = require("./padelBooking");

db.ROLES = ["user", "admin"];

module.exports = db;