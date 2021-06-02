'use strict'

const db = require("../models");
const Actividad = db.actividad;
const Usuario = db.user;
const Reseña = db.reseña;
const VotosReseña = db.votosReseña;

var controller = {
    create: (req, res) => {
        var params = req.body;

        if (!params) {
            res.status(400).send({ message: "¡Faltan datos!" });
            return;
        }

        const actividad = new Actividad({
            nombre: params.nombre,
            descripcion: params.descripcion,
            horario: params.horario,
            dias: params.dias,
            monitor: params.monitor,
            maxAforo: params.maxAforo,
            cliApuntados: 0,
            //imagenes: null,  por ser array o por otra cosa hay q poner el 0
        });

        actividad.save()
            .then(data => {
                res.status(200).send({ message: "¡Actividad creada correctamente!", data });
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Un error ocurrió mientras se creaba la Actividad."
                });
            });
    },
    findByNombre: (req, res) => {   //EN DESUSO
        const nombre = req.query.nombre;
        var condition = nombre ? { nombre: { $regex: new RegExp(nombre), $options: "i" } } : {};

        Actividad.find(condition)
            .then(data => {
                console.log(data);
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Un error ocurrió mientras se buscaba y delvolvía la Actividad."
                });
            });
    },
    getAllActividades: (req, res) => {
        //find para mongodb
        Actividad.find({}).sort('-_id').exec((err, acts) => {
            if (err) {
                return res.status(500).send({
                    status: "error",
                    message: "Error."
                });

            } else if (!acts) {
                return res.status(404).send({
                    status: "error",
                    message: "No hay usuarios."
                });
            } else {
                return res.status(200).send({
                    status: "success",
                    acts
                });
            }
        });
    },
    getActividad: (req, res) => {
        const id = req.params.id;

        Actividad.findById(id)
            .then(act => {
                if (!act)
                    res.status(404).send({ message: "No se encontró ninguna Actividad con id: " + id });
                else res.send(act);
            })
            .catch(err => {
                res
                    .status(500)
                    .send({ message: "Error al recuperar Actividad con id=" + id });
            });
    },
    apuntarActividad: (req, res) => {
        if (!req.body) {
            return res.status(400).send({
                message: "¡Faltan datos!"
            });
        }

        var id = req.params.id;
        var userID = req.body.userID;

        Actividad.findByIdAndUpdate(id, { $push: { 'usuarios': userID }, $inc: { 'cliApuntados': +1 } }, { new: true, useFindAndModify: false })
            .then(act => {
                if (!act) {
                    res.status(404).send({
                        message: `¡No se puede actualizar Actividad con id=${id}. ¡Quizás no fue encontrada!`
                    });
                } else {
                    Usuario.findByIdAndUpdate(userID, { $push: { 'actividades': id } }, { new: true, useFindAndModify: false })
                        .then(user => {
                            //console.log(user);
                            res.status(200).send({
                                message: "Usuario registrado correctamente en la Actividad."
                            });
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).send({
                                message: "Error al registrar Usuario con id=" + userID + "en Actividad con id=" + id
                            });
                        });
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).send({
                    message: "Error al registrar Usuario con id=" + userID + "en Actividad con id=" + id
                });
            });
    },
    desapuntarActividad: (req, res) => {
        if (!req.body) {
            return res.status(400).send({
                message: "¡Faltan datos!"
            });
        }

        var id = req.params.id;
        var userID = req.body.userID;
        Actividad.findByIdAndUpdate(id, { $pull: { 'usuarios': { $in: [userID] } }, $inc: { 'cliApuntados': -1 } }, { new: true, useFindAndModify: false })
            .then(act => {
                if (!act) {
                    res.status(404).send({
                        message: `¡No se puede actualizar Actividad con id=${id}. ¡Quizás no fue encontrada!`
                    });
                } else {
                    Usuario.findByIdAndUpdate(userID, { $pull: { 'actividades': { $in: [id] } } }, { new: true, useFindAndModify: false })
                        .then(user => {
                            //console.log(user);
                            res.status(200).send({
                                message: "Usuario desapuntado correctamente."
                            });
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).send({
                                message: "Error al desapuntar Usuario con id=" + userID + "en Actividad con id=" + id
                            });
                        });
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).send({
                    message: "Error al desapuntar Usuario con id=" + userID + "en Actividad con id=" + id
                });
            });
    },
    deleteAct: (req, res) => {
        const id = req.params.id;

        Actividad.findByIdAndRemove(id)
            .then(act => {
                if (!act) {
                    res.status(404).send({
                        message: `¡No se puede borrar Actividad con id=${id}. ¡Quizás no fue encontrada!`
                    });
                } else {
                    if (act.usuarios.length > 0) {
                        act.usuarios.forEach(userID => {
                            Usuario.findByIdAndUpdate(userID, { $pull: { 'actividades': { $in: [id] } } }, { multi: true })
                                .then(user => {
                                    if (!user) {
                                        res.status(404).send({
                                            message: `No se puede borrar Actividad con id=${id} del Usuario con id=${userID}.`
                                        });
                                    } else {
                                        res.status(200).send({
                                            message: "¡Actividad borrada correctamente!"
                                        });
                                    }
                                })
                                .catch(err => {
                                    console.log(err);
                                    res.status(500).send({
                                        message: `¡Error al borrar actividad de los usuarios!`
                                    });
                                });
                        });
                    }
                    else {
                        res.status(200).send({
                            message: "¡Actividad borrada correctamente!"
                        });
                    }
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).send({
                    message: "No se pudo borrar actividad con id=" + id
                });
            });
    },
    searchActividad: (req, res) => {
        var searchString = req.params.search;

        //si el searchString esta contenido en el nombre o en la descripcion
        Actividad.find({
            "$or": [
                { "nombre": { "$regex": searchString, "$options": "i" } },
                { "descripcion": { "$regex": searchString, "$options": "i" } }
            ]

        })
            .sort([['descending']])
            .exec((err, acts) => {
                if (err) {
                    console.log(err);
                    res.status(500).send({
                        message: "¡Fallo en la red al buscar Actividad!"
                    });
                }
                if (!acts || acts.length <= 0) {
                    return res.status(404).send({
                        message: "¡No se encontró ninguna actividad correspondiente a tu búsqueda!"
                    });
                } else {
                    return res.status(200).send({
                        acts
                    });
                }
            });
    },

    //reseñas
    createReseña: (req, res) => {
        var des = req.body.descripcion;

        if (!des) {
            res.status(400).send({ message: "¡Faltan datos!" });
            return;
        }

        const reseña = new Reseña({
            descripcion: des,
            actividad: req.body.actID,
            usuario: req.body.userID
        });

        reseña.save()
            .then(data => {
                Actividad.findByIdAndUpdate(req.body.actID, { $push: { 'reseñas': data._id } }, { new: true, useFindAndModify: false })
                    .then(act => {
                        if (!act) {
                            res.status(404).send({
                                message: `No se pudo actualizar Actividad id=${req.body.actID}. ¡Quizás no fue encontrada!`
                            });
                        } else {
                            const votosReseña = new VotosReseña({
                                contadorFavor: {
                                    contador: 0,
                                },
                                contadorContra: {
                                    contador: 0,
                                },
                                reseña: data._id
                            });
                            votosReseña.save()
                                .then(vRes => {
                                    console.log(vRes);
                                    res.status(200).send({
                                        message: "Reseña registrada en Actividad correctamente.",
                                        data
                                    });
                                })
                                .catch(err => {
                                    console.log(err);
                                    res.status(500).send({
                                        message: "¡Error al crear los VotosReseña para la Reseña!"
                                    });
                                });
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).send({
                            message: "Error al crear Reseña con id=" + data._id + " en Actividad con id=" + req.body.actID
                        });
                    });
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Algún error sucedió mientras se creaba la Reseña."
                });
            });
    },
    deleteReseña: (req, res) => {
        const id = req.params.id;

        Reseña.findByIdAndRemove(id)
            .then(ress => {
                if (!ress) {
                    res.status(404).send({
                        message: `No se pudo borrar la Reseña con id=${id}. ¡Quizás no fue encontrada!`
                    });
                } else {
                    Actividad.findByIdAndUpdate(ress.actividad, { $pull: { 'reseñas': { $in: [id] } } }, { multi: true })
                        .then(act => {
                            if (!act) {
                                res.status(404).send({
                                    message: `No se pudo borrar Reseña con id: ${id} de Actividad con id=${ress.actividad}. ¡Quizás la Actividad no fue encontrada!`
                                });
                            } else {
                                VotosReseña.findOneAndRemove({ 'reseña': id })
                                    .then(vRes => {
                                        res.status(200).send({
                                            message: "¡Reseña borrada con éxito!"
                                        });
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        res.status(500).send({
                                            message: `Error al remover VotosReseña de Reseña con id: ${id} de Actividad con id=` + ress.actividad
                                        });
                                    });
                            }
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).send({
                                message: `Error al borrar Reseña con id: ${id} de Actividad con id=` + ress.actividad
                            });
                        });
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).send({
                    message: "No se pudo borrar Reseña con id=" + id
                });
            });
    },
    getAllReseñas: (req, res) => {
        const actID = req.params.id;

        Reseña.find({ 'actividad': actID })
            .then(ress => {
                if (!ress) {
                    res.status(404).send({
                        message: `¡No se encontró ninguna Reseña!`
                    });
                } else {
                    let reseñs = [];
                    Usuario.find({})
                        .then(users => {
                            VotosReseña.find({})
                                .then(vRes => {
                                    users.forEach(user => {
                                        ress.forEach(reseña => {
                                            vRes.forEach(voto =>{
                                                if (user._id.equals(reseña.usuario) && reseña._id.equals(voto.reseña)){
                                                    var resjson = {
                                                        authorname: user.nombre,
                                                        authorsurname: user.apellidos,
                                                        authoremail: user.email,
                                                        reseña,
                                                        contadorContra: voto.contadorContra.contador,
                                                        contadorFavor: voto.contadorFavor.contador
                                                    };
                                                    reseñs.push(resjson);
                                                }
                                            });
                                        });
                                    });
                                    res.status(200).send(reseñs);
                                })
                                .catch(err => {
                                    console.log(err);
                                    res
                                        .status(500)
                                        .send({ message: " Error al devolver VotosReseña de Reseña!" });
                                });
                        })
                        .catch(err => {
                            console.log(err);
                            res
                                .status(500)
                                .send({ message: "Error recuperando Usuarios" });
                        });
                }
            })
            .catch(err => {
                console.log(err);
                res
                    .status(500)
                    .send({ message: "Error al recuperar Actividad con id=" + actID });
            });
    },
    updateVotosFromReseña: (req, res) => {
        var resID = req.params.id;
        var userID = req.body.userID;
        var vContra = req.body.vContra;
        var vFavor = req.body.vFavor;

        VotosReseña.findOne({ 'reseña': resID })
            .then(vRes => {
                if (!vRes) {
                    res.status(404).send({
                        message: `¡No se encontró VotosReseña!`
                    })
                }
                //ya habia votado y vuelve a votar a favor --> se quita el voto
                else if (vRes.contadorFavor.usuarios.includes(userID) && vFavor) {
                    VotosReseña.findByIdAndUpdate(vRes._id, { $pull: { 'contadorFavor.usuarios': { $in: [userID] } }, $inc: { 'contadorFavor.contador': -1 } }, { multi: true, new: true })
                        .then(voto => {
                            console.log(voto);
                            res.status(200).send({
                                message: "¡Usuario votó correctamente!."
                            });
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).send({
                                message: "Error al votar Reseña con id=" + resID + ".Usuario, id=" + userID
                            });
                        });
                }
                //ya habia votado y vuelve a votar pero ahora en contra --> se quita el voto a favor y se añade en contra
                else if (vRes.contadorFavor.usuarios.includes(userID) && vContra) {
                    VotosReseña.findByIdAndUpdate(vRes._id, { $pull: { 'contadorFavor.usuarios': { $in: [userID] } }, $inc: { 'contadorFavor.contador': -1 } }, { multi: true, new: true })
                        .then(v => {
                            VotosReseña.findByIdAndUpdate(vRes._id, { $push: { 'contadorContra.usuarios': userID }, $inc: { 'contadorContra.contador': +1 } }, { multi: true, new: true })
                                .then(voto => {
                                    console.log(voto);
                                    res.status(200).send({
                                        message: "¡Usuario votó correctamente!."
                                    });
                                })
                                .catch(err => {
                                    console.log(err);
                                    res.status(500).send({
                                        message: "Error al votar Reseña con id=" + resID + ".Usuario, id=" + userID
                                    });
                                });
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).send({
                                message: "Error al votar Reseña con id=" + resID + ".Usuario, id=" + userID
                            });
                        });
                }
                //ya habia votado y vuelve a votar en contra --> se quita el voto
                else if (vRes.contadorContra.usuarios.includes(userID) && vContra) {
                    VotosReseña.findByIdAndUpdate(vRes._id, { $pull: { 'contadorContra.usuarios': { $in: [userID] } }, $inc: { 'contadorContra.contador': -1 } }, { multi: true, new: true })
                        .then(voto => {
                            console.log(voto);
                            res.status(200).send({
                                message: "¡Usuario votó correctamente!"
                            });
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).send({
                                message: "Error al votar Reseña con id=" + resID + ".Usuario, id=" + userID
                            });
                        });
                }
                //ya habia votado y vuelve a votar pero ahora a favor --> se quita el voto en contra y se añade a favor
                else if (vRes.contadorContra.usuarios.includes(userID) && vFavor) {
                    VotosReseña.findByIdAndUpdate(vRes._id, { $pull: { 'contadorContra.usuarios': { $in: [userID] } }, $inc: { 'contadorContra.contador': -1 } }, { multi: true, new: true })
                        .then(v => {
                            VotosReseña.findByIdAndUpdate(vRes._id, { $push: { 'contadorFavor.usuarios': userID }, $inc: { 'contadorFavor.contador': +1 } }, { multi: true, new: true })
                                .then(voto => {
                                    console.log(voto);
                                    res.status(200).send({
                                        message: "¡Usuario votó correctamente!."
                                    });
                                })
                                .catch(err => {
                                    console.log(err);
                                    res.status(500).send({
                                        message: "Error al votar Reseña con id=" + resID + ".Usuario, id=" + userID
                                    });
                                });
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).send({
                                message: "Error al votar Reseña con id=" + resID + ".Usuario, id=" + userID
                            });
                        });
                }
                //no habia votado
                else {
                    //vota por primera vez a favor
                    if (vFavor) {
                        VotosReseña.findByIdAndUpdate(vRes._id, { $push: { 'contadorFavor.usuarios': userID }, $inc: { 'contadorFavor.contador': +1 } }, { multi: true, new: true })
                            .then(voto => {
                                console.log(voto);
                                res.status(200).send({
                                    message: "¡Usuario votó correctamente!."
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).send({
                                    message: "Error al votar Reseña con id=" + resID + ".Usuario, id=" + userID
                                });
                            });
                    }
                    //vota por primera vez en contra
                    if (vContra) {
                        VotosReseña.findByIdAndUpdate(vRes._id, { $push: { 'contadorContra.usuarios': userID }, $inc: { 'contadorContra.contador': +1 } }, { multi: true, new: true })
                            .then(voto => {
                                console.log(voto);
                                res.status(200).send({
                                    message: "¡Usuario votó correctamente!"
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).send({
                                    message: "Error al votar Reseña con id=" + resID + ".Usuario, id=" + userID
                                });
                            });
                    }
                }
            })
            .catch(err => {
                console.log(err);
                res
                    .status(500)
                    .send({ message: "Error recuperando VotosReseña." });
            });
    },
}; // end controller

module.exports = controller;