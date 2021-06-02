'use strict'

const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;
const Matricula = db.matricula;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");
var validator = require('validator');
const saltRounds = 10;

exports.signup = (req, res) => {
    var params = req.body;

    try {
        var validateName = !validator.isEmpty(params.nombre);
        var validateApell = !validator.isEmpty(params.apellidos);
        var validateEmail = validator.isEmail(params.email);
    } catch (err) {
        return res.status(404).send({
            status: "error",
            message: "Datos incorrectos"
        });
    }

    if (validateName && validateApell && validateEmail) {
        var salt = bcrypt.genSaltSync(saltRounds);
        var hash = bcrypt.hashSync(params.contraseña, salt);
        //asi no funciona, intentar arreglarlo por q
        //es recomendado en un server ya q el sync consume
        //para arreglarlo poner async y await
        //mucho cpu
        /*bcrypt.genSalt(saltRounds, (err, salt) => {
            //genSalt
            if (err) {
                return res.status(500).send({
                    status: "error",
                    message: "Error al generar salt..."
                });
            } else {
                bcrypt.hash(params.contraseña, salt, (err, hash) => {
                    // Store hash in your password DB.
                    if (err) {
                        return res.status(500).send({
                            status: "error",
                            message: "Error al encriptar contraseña..."
                        });
                    } else {
                        //ERROR no lo almacena en mongo
                        //pero lo asigna bien
                        usuario.contraseña = hash;
                        console.log("contraseña "+ usuario.contraseña);
                    }
                });
            }
        });*/
        const matricula = new Matricula({
            type: 0,
            isPaid: false,
            usuario: null
        });

        matricula.save()
            .then(data => {
                const user = new User({
                    nombre: params.nombre,
                    apellidos: params.apellidos,
                    email: params.email,
                    contraseña: hash,
                    matricula: data._id,    //lo pilla raro
                    datosPersonales: {
                        peso: null,
                        altura: null,
                        imc: null,
                    },
                    roles: params.roles0,    //por ser array o por otra cosa hay q poner el 0
                    nBooks: 0
                });

                user.save((err, user) => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }
                    Matricula.findByIdAndUpdate(data._id, { 'usuario': user._id }, { useFindAndModify: false })
                        .then(() => {
                            if (params.roles) {
                                Role.find(
                                    {
                                        name: { $in: params.roles }
                                    },
                                    (err, roles) => {
                                        if (err) {
                                            res.status(500).send({ message: err });
                                            return;
                                        }

                                        user.roles = roles.map(role => role._id);
                                        user.save(err => {
                                            if (err) {
                                                res.status(500).send({ message: err });
                                                return;
                                            }

                                            res.send({ message: "¡Usuario registrado correctamente!" });
                                        });
                                    }
                                );
                            } else {
                                Role.findOne({ name: "user" }, (err, role) => {
                                    if (err) {
                                        res.status(500).send({ message: err });
                                        return;
                                    }

                                    user.roles = [role._id];
                                    user.save(err => {
                                        if (err) {
                                            res.status(500).send({ message: err });
                                            return;
                                        }

                                        res.send({ message: "¡Usuario registrado correctamente!" });
                                    });
                                });
                            }
                        }).catch(err => {
                            console.log(err);
                            res.status(500).send({
                                message: `¡Error al actualizar Matricula del Usuario mientras se registraba!`
                            });
                        });
                });
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Algún error ocurrió mientras se creaba la Matricula."
                });
            });


    } else {
        return res.status(404).send({
            status: "error",
            message: "Datos invalidos"
        });
    }
};

exports.signin = (req, res) => {
    var params = req.body;
    //validar params con validator
    try {
        var userEmail = validator.isEmail(params.email);
        var userPass = !validator.isEmpty(params.contraseña);
    } catch (err) {
        return res.status(404).send({
            status: "error",
            message: "Datos incorrectos"
        });
    }

    if (userPass && userEmail) {
        User.findOne({
            email: params.email
        })
            .populate("roles", "-__v")
            .exec((err, user) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }

                if (!user) {
                    return res.status(404).send({ message: "Usuario no encontrado." });
                }

                var passwordIsValid = bcrypt.compareSync(
                    params.contraseña,
                    user.contraseña
                );

                if (!passwordIsValid) {
                    return res.status(401).send({
                        accessToken: null,
                        message: "¡Contraseña incorrecta!"
                    });
                }

                var token = jwt.sign({ id: user.id }, config.secret, {
                    expiresIn: 86400 // 24 hours
                });

                var authorities = [];

                for (let i = 0; i < user.roles.length; i++) {
                    authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
                }

                res.status(200).send({
                    status: "success",
                    id: user._id,
                    nombre: user.nombre,
                    email: user.email,
                    roles: authorities,
                    accessToken: token
                });
            });
    }
};