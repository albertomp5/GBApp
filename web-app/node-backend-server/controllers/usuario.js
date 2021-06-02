'use strict'

const db = require("../models");
const Actividad = db.actividad;
const Usuario = db.user;
const Matricula = db.matricula;
const Role = db.role;

var controller = {
    test: (req, res) => {
        return res.status(200).send({
            message: "BACKEND ACTIVO"
        });
    },
    getUsers: (req, res) => {
        //find para mongodb
        Usuario.find({}).sort('-_id').exec((err, users) => {
            if (err) {
                return res.status(500).send({
                    message: "Error"
                });

            } else if (!users) {
                return res.status(404).send({
                    message: "No hay usuarios."
                });
            } else {
                return res.status(200).send({
                    users
                });
            }
        });
    },
    getUser: (req, res) => {
        //recoger id de la url
        var userID = req.params.id;

        //comprobar q existe
        if (!userID || userID == null || userID == undefined) {
            return res.status(404).send({
                status: "error",
                message: "¡Faltan datos!"
            });
        }

        //buscar al usuario
        Usuario.findById(userID, (err, user) => {
            if (err) {
                return res.status(500).send({
                    message: "Error en el server"
                });
            } else if (!user) {
                return res.status(404).send({
                    message: "No existe el usuario."
                });
            } else {
                return res.status(200).send({
                    user
                });
            }
        });
    },

    searchUser: (req, res) => {
        var searchString = req.params.search;

        //si el searchString esta contenido en el nombre o en los apellidos
        Usuario.find({
            "$or": [
                { "nombre": { "$regex": searchString, "$options": "i" } },
                { "apellidos": { "$regex": searchString, "$options": "i" } },
                { "email": { "$regex": searchString, "$options": "i" } }
            ]
        })
            .sort([['descending']])
            .exec((err, users) => {
                if (err) {
                    return res.status(500).send({
                        message: "¡Error en la red!"
                    });
                } else if (!users || users.length <= 0) {
                    return res.status(404).send({
                        message: "¡No se encontró ningún Usuario relacionado con tu búsqueda!"
                    });
                } else {
                    return res.status(200).send({
                        users
                    });
                }
            });
    },

    allAccess: (req, res) => {
        res.status(200).send("Public Content.");
    },
    userBoard: (req, res) => {
        res.status(200).send("User Content.");
    },
    getUserData: (req, res) => {
        //recoger id de la url
        var userID = req.params.id;

        //comprobar q existe
        if (!userID || userID == null || userID == undefined) {
            return res.status(404).send({
                status: "error",
                message: "¡Faltan datos!"
            });
        }

        //buscar al usuario
        Usuario.findById(userID, (err, user) => {
            if (err) {
                return res.status(500).send({
                    status: "error",
                    message: "Error en el servidor."
                });
            } else if (!user) {
                return res.status(404).send({
                    status: "error",
                    message: "No existe el usuario."
                });
            } else {
                var userData = user.datosPersonales;
                return res.status(200).send({
                    status: "success",
                    userData
                });
            }
        });
    },
    updateUserData: (req, res) => {
        if (!req.body) {
            return res.status(400).send({
                message: "¡Faltan datos!"
            });
        }

        const id = req.params.id;

        Usuario.findByIdAndUpdate(id, {
            datosPersonales: {
                peso: req.body.body.peso,
                altura: req.body.body.altura,
                imc: req.body.body.imc,
            }
        }, { useFindAndModify: false })
            .then(user => {
                if (!user) {
                    res.status(404).send({
                        message: `No se pudo actualizar Usuario con id=${id}. ¡Quizás no fue encontrado!`
                    });
                } else {
                    res.send({
                        message: "Usuario actualizado correctamente.",
                    });
                }
            })
            .catch(err => {
                res.status(500).send({
                    message: "Error al actualizar Usuario con id=" + id
                });
            });
    },
    adminBoard: (req, res) => {
        res.status(200).send("Admin Content.");
    },

    deleteUser: (req, res) => {
        const id = req.params.id;

        Usuario.findByIdAndRemove(id)
            .then(user => {
                if (!user) {
                    res.status(404).send({
                        message: `No se pudo borrar el Usuario con id=${id}. ¡Quizás no se encontró!`
                    });
                } else {
                    Matricula.findOneAndRemove({ 'usuario': id }).then(() => {
                        if (user.actividades.length > 0) {
                            user.actividades.forEach(actID => {
                                Actividad.findByIdAndUpdate(actID, { $pull: { 'usuarios': { $in: [id] } }, $inc: { 'cliApuntados': -1 } }, { new: true, multi: true, useFindAndModify: false })
                                    .then(act => {
                                        if (!act) {
                                            res.status(404).send({
                                                message: `No se pudo quitar al Usuario con ${id} de las Actividades.`
                                            });
                                        } else {
                                            res.status(200).send({
                                                message: "¡Usuario fue borrado correctamente!"
                                            });
                                        }
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        res.status(500).send({
                                            message: `Error al borrar el Usuario de las Actividades.`
                                        });
                                    });
                            });
                        } else{
                            res.status(200).send({
                                message: "¡Usuario fue borrado correctamente!"
                            });
                        }
                    })
                        .catch(err => {
                            console.log(err);
                            res.status(500).send({
                                message: `Error borrando Matricula del Usuario con id ${id}.`
                            });
                        });
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).send({
                    message: `Error borrando Usuario con id: ${id}.`
                });
            });
    },
    getMatricula: (req, res) => {
        const id = req.params.id;
        Matricula.findOne({ 'usuario': id })
            .then(mat => {
                if (!mat) {
                    res.status(404).send({
                        message: `¡Matricula del Usuario con id: ${id} no fue encotrada!`
                    });
                } else {
                    res.status(200).send({
                        mat
                    });
                }
            }).catch(err => {
                return res.status(500).send({message: err});
            });
    },
    pagarMatricula: (req, res) => { 
        const id = req.params.id;
        var params = req.body;

        if (!params) {
            res.status(400).send({ message: "¡Faltan datos!" });
            return;
        }

        Usuario.findById(id)
            .then(user => {
                if (!user)
                    res.status(404).send({ message: "No se encotro ningún usuario con id: " + id });
                else {
                    Matricula.findByIdAndUpdate(user.matricula, { 'isPaid': true, 'type': params.type }, { useFindAndModify: false })
                        .then(mat => {
                            if (!mat) {
                                res.status(404).send({
                                    message: `No se pudo actualizar Matricula con id: ${user.matricula}.`
                                });
                            } else {
                                res.status(200).send({
                                    message: "¡Usuario pago correctamente!",
                                    mat
                                });
                            }
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).send({
                                message: `Error actualizando Matricula del Usuario con id: ${id}.`
                            });
                        });
                }
            })
            .catch(err => {
                console.log(err);
                res
                    .status(500)
                    .send({ message: "Error recuperando usuario con id=" + id });
            });
    },
    actualizarMatriculas: () => {
        Matricula.updateMany({}, { 'isPaid': false, 'type': 0 }, { useFindAndModify: false })
            .then((error, mats) => {
                if (error) console.log(error);
                else console.log("¡Matriculas actualizadas correctamente! Matriculas: " + mats);
            }) //igual el catch falla
            .catch(err => {
                console.log(err);
            });
    },
    mPaid: (req, res) => {
        Matricula.findOne({ 'usuario': req.params.id })
            .then((mat) => {
                if (!mat) return res.status(404).send({ message: "No se encontro ninguna Matricula para el Usuario con id:" + req.params.id });
                else {
                    if (mat.isPaid) {
                        return res.status(200).send({ message: "¡Matricula ya pagada!", mat });
                    }
                    else {
                        return res.status(402).send({ message: "¡Matricula pendiente de pago!", mat })
                    }
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).send({
                    message: `Error with Matricula from User with id: ${req.params.id}`
                });
            });
    },
    updateNBooks: () => {
        Usuario.updateMany({}, { 'nBooks': 0 }, { useFindAndModify: false })
            .then((error, users) => {
                if (error) console.log(error);
                else console.log("¡Usuarios actualizados correctamente! Usuarios: " + users);
            }) //igual el catch falla
            .catch(err => {
                console.log(err);
            });
    },
    hacerAdmin: (req, res) => {
        var userID = req.params.id;

        Role.findOne({ 'name': 'admin' })
            .then(role => {
                Usuario.findByIdAndUpdate(userID, { $push: { 'roles': role._id } }, { new: true, useFindAndModify: false })
                    .then(user => {
                        if (!user) {
                            res.status(404).send({
                                message: `No se encontro ningún usuario con id: ${id}.`
                            });
                        } else {
                            res.send({
                                message: "¡Usuario actualizado correctamente!"
                            });
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).send({
                            message: `¡Error actualizando los roles del Usuario!`
                        });
                    });
            })
            .catch(err => {
                res.status(500).send({ message: err.message || `Error actualizando los roles del Usuario con id: ${userID}` })
            });
    }

}; // end controller

module.exports = controller;