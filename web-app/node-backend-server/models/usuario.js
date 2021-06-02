'use strict'

var mongoose = require('mongoose');

const User = mongoose.model(
    'Usuario',
    new mongoose.Schema({
        nombre : String, 
        apellidos : String,
        email : String,
        contraseña : String,   
        imagenes: [String], 
        datosPersonales: {
            peso: Number,
            altura: Number,
            imc: Number,
        },
        roles: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Role"
            }
        ],
        matricula: 
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Matricula"
            }
        ,
        actividades: [
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Actividad"
            }
        ],
        nBooks: Number
        //lastActive: Date          //si pasa x tiempo desde la ultima vez que se activo eliminar user
    })
  );


/*  
BCRYPT SALT = 10
User.schema.pre o User.pre("save", async function (next) {
  if (!this.isModified("contraseña")) {
    return next();
  }
  const hash = await bcrypt.hash(this.contraseña, Number(bcryptSalt));
  this.contraseña = hash;
  next();
});*/
module.exports = User;