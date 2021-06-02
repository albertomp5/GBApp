'use strict'

const db = require("../models");
const Usuario = db.user;
const Maquina = db.maquina;
const Gym = db.gym;
const Booking = db.booking;

var controller = {
    getGymData: (req, res) => {
        Gym.findById(gymID)
            .then(gym => {
                if (!gym)
                    res.status(404).send({ message: "No se encontró gym con id: " + gymID });
                else res.send(gym);
            })
            .catch(err => {
                res
                    .status(500)
                    .send({ message: "Error recuperando Gym con id=" + gymID });
            });
    },
    createBooking: (req, res) => {    
        // Validate request
        if (!req.body.date) {
            res.status(400).send({ message: "¡Faltan datos!" });
            return;
        }

        Booking.findOne({ 'date': req.body.date, 'hora': req.body.hora }, (err, bking) => {
            if (err) {
                return res.status(500).send({
                    message: "¡Error en la red!"
                });
            } else if (!bking) {
                // Create a Maquina
                var book = new Booking({
                    date: req.body.date,
                    actualBooks: 1,
                    maxBooks: 10,
                    hora: req.body.hora,
                    usuarios: req.body.userID,
                });

                book
                    .save()
                    .then(bk => {
                        Usuario.findByIdAndUpdate(req.body.userID, { $inc: { 'nBooks': +1 } }, { new: true, useFindAndModify: false })
                            .then(user => {
                                res.status(200).send({
                                    message: "¡Reserva creada correctamente!",
                                    bk
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).send({
                                    message: err.message || "¡Algún error ocurrio actualizando Usuario con id:" + req.body.userID + "!"
                                });
                            });
                    })
                    .catch(err => {
                        res.status(500).send({
                            message:
                                err.message || "¡Algún error ocurrio mientras se creaba la Reserva!."
                        });
                    });
            } else {
                Booking.findByIdAndUpdate(bking._id, { $push: { 'usuarios': req.body.userID }, $inc: { 'actualBooks': +1 } }, { new: true, useFindAndModify: false })
                    .then(bk => {
                        Usuario.findByIdAndUpdate(req.body.userID, { $inc: { 'nBooks': +1 } }, { new: true, useFindAndModify: false })
                            .then(user => {
                                res.status(200).send({
                                    message: "!Reserva creada correctamente!",
                                    bk
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).send({
                                    message: err.message || "¡Algún error ocurrio mientras se actualizaba el Usuario con id:" + req.body.userID + "!"
                                });
                            });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).send({
                            message: err.message || "¡Algún error ocurrió mientras se realizaba la reserva!."
                        });
                    });
            }
        });
    },
    cancelBooking: (req, res) => {    
        // Validate request
        if (!req.body) {
            res.status(400).send({ message: "¡Faltan datos!" });
            return;
        }

        var bookingID = req.body.id;
        var userID = req.body.userID;

        Booking.findByIdAndUpdate(bookingID, { $pull: { 'usuarios': { $in: [userID] } }, $inc: { 'actualBooks': -1 } }, { new: true, useFindAndModify: false })
            .then(booking => {
                if (!booking) {
                    res.status(404).send({
                        message: `No se puede actualizar la reserva id=${bookingID}. ¡Quizás no fue encontrada!`
                    });
                } else {
                    Usuario.findByIdAndUpdate(userID, { $inc: { 'nBooks': -1 } }, { new: true, useFindAndModify: false })
                        .then(user => {
                            res.status(200).send({
                                message: "¡Usuario canceló la reserva correctamente!",
                                user
                            });
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).send({
                                message: "Error al cancelar la reserva conid:" + bookingID + " del Usuario con id=" + userID
                            });
                        });
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).send({
                    message: "Error al cancelar la reserva conid:" + bookingID + " del Usuario con id=" + userID
                });
            });
    },
    getAllBookingsInADay: (req, res) => {
        //console.log(req.params.date);
        var date = req.params.date.split(":");
        date = date[0] + "/" + date[1] + "/" + date[2];
        Booking.find({ 'date': date }).sort('-_id').exec((err, bookings) => {
            if (err) {
                return res.status(500).send({
                    message: "¡Error en la red!"
                });

            } else if (!bookings) {
                return res.status(404).send({
                    message: "¡No se encontraron reservas para este día!"
                });
            } else {
                return res.status(200).send({
                    bookings
                });
            }
        });
    },
    getAllUserBookings: (req, res) => {
        Booking.find({ 'usuarios': { $in: [req.params.id] } }).sort('-_id').exec((err, bookings) => {
            if (err) {
                return res.status(500).send({
                    message: "¡Error en la red!"
                });

            } else if (!bookings) {
                return res.status(404).send({
                    message: "No se encontró ninguna reserva para el Usuario con id:" + req.params.id
                });
            } else {
                return res.status(200).send({
                    bookings
                });
            }
        });
    },
    checkUserHasHourBookedNow: (req, res) => {;
        var userID = req.body.userID;
        var date = req.body.date;
        var hour = req.body.hour;

        Booking.findOne({'usuarios': { $in: [userID] }, 'date': date, 'hora': hour }).exec((err, book) => {
            if (err) {
                return res.status(500).send({
                    message: "¡Error en la red!"
                });
            } else if (book) {
                return res.status(200).send({
                    message: "¡Tiene reserva ahora!",
                    book
                });
            }
        });
    },
    updateAforoActualGym: () => {   
        var date = new Date();
        var dia = date.getUTCDate();
        var mes = date.getUTCMonth() + 1;
        var año = date.getUTCFullYear();
        var hora = date.getHours().toString() + ":00";
        var fecha = dia.toString() + "/" + mes.toString() + "/" + año.toString();
        Booking.findOne({ 'date': fecha, 'hora': hora }).exec((err, book) => {
            if (err) {
                console.log(err);
            } else if (!book) {
                Gym.findByIdAndUpdate(gymID, { 'aforoActual': 0, 'horario': fecha + "|" + hora }, { new: true, useFindAndModify: false })
                    .then(gym => {
                        console.log("¡Gym actualizado correctamente!" + gym);
                    })
                    .catch(err => {
                        console.log("¡Algún error ocurrió mientras se actualizaba el Gym!" + TypeError);
                    });
            } else {
                Gym.findByIdAndUpdate(gymID, { 'aforoActual': book.actualBooks, 'horario': fecha + "|" + hora }, { new: true, useFindAndModify: false })
                    .then(gym => {
                        console.log("¡Gym actualizado correctamente!" + gym);
                    })
                    .catch(err => {
                        console.log("¡Algún error ocurrió mientras se actualizaba el Gym!" + err);
                    });
            }
        });
    },
    deleteCaducatedBooks: () => { 
        var todaysDate = new Date();
        todaysDate.setHours(0, 0, 0, 0);
        
        Booking.find({})
            .then(bookings => {
                bookings.forEach(booking => {
                    var dateSplits = booking.date.split("/");
                    var daySplit = dateSplits[0];
                    var monthSplit = dateSplits[1];
                    var yearSplit = dateSplits[2];
                    var bookingDay = new Date(yearSplit, monthSplit-1, daySplit);
                    var bookingDayPlusOneWeek = bookingDay.getTime() +604800000;  //+ 7 Days=604800000ms --> si quiero que duren una semana caducadas

                    //bookingDay --> bookingDayPlusOneWeek --> Registro de una semana caducadas hasta borrar
                    if (todaysDate > bookingDay) {
                        Booking.findByIdAndRemove(booking._id)
                        .then(data => {
                            console.log("Reserva borrada del registro!");
                            console.log(data);
                        })
                        .catch(err => {
                            console.log(err.message || "Algún error ocurrió mientras se borraba la reserva con id:" + booking._id);
                        });
                    } 
                });
            })
            .catch(err => {
                console.log(err.message || "Algún error ocurrió cuando se recuperaban las reservas.");
            });
    },
    deleteBooksWithoutUsers: () => {
        Booking.deleteMany({ 'actualBooks': 0 }, function (err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log(result)
            }
        });
    },
    createMaquina: (req, res) => {
        // Validate request
        if (!req.body.nombre) {
            res.status(400).send({ message: "¡Faltan datos!" });
            return;
        }

        // Create a Maquina
        var maquina = new Maquina({
            nombre: req.body.nombre,
            estado: false
        });

        // Save Maquina in the database
        maquina
            .save()
            .then(maq => {
                //incrementear el numero de maquinas del gym
                Gym.findByIdAndUpdate(gymID, { $push: { 'maquinas': maq._id }, $inc: { 'nMaquinas': +1 } }, { useFindAndModify: false })
                    .then(data => {
                        if (!data) {
                            res.status(404).send({
                                message: `No se puede actualizar Gym con id=${gymID}. ¡Quizás no fue encontrado!`
                            });
                        } else res.send({
                            message: "¡Maquina registrada correctamente!",
                            maq
                        });
                    })
                    .catch(err => {
                        res.status(500).send({
                            message: "Error al actualizar Gym con id=" + gymID
                        });
                    });
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Algún error ocurrió mientras se creaba la Maquina."
                });
            });
    },
    getMaquinas: (req, res) => {
        //find para mongodb
        Maquina.find({}).sort('-_id').exec((err, maqs) => {
            if (err) {
                return res.status(500).send({
                    message: "Error"
                });

            } else if (!maqs) {
                return res.status(404).send({
                    message: "¡No se encontro ninguna Maquina!"
                });
            } else {
                return res.status(200).send({
                    maqs
                });
            }
        });
    },
    getMaquina: (req, res) => {
        //recoger id de la url
        var maqID = req.params.id;

        //comprobar q existe
        if (!maqID || maqID == null || maqID == undefined) {
            return res.status(404).send({
                message: "Error!"
            });
        }

        //buscar al usuario
        Maquina.findById(maqID, (err, maq) => {
            if (err) {
                return res.status(500).send({
                    message: "¡Error en la red!"
                });
            } else if (!maq) {
                return res.status(404).send({
                    message: "No se encontro ninguna Maquina con id:" + maqID
                });
            } else {
                return res.status(200).send({
                    maq
                });
            }
        });
    },
    deleteMaquina: (req, res) => {
        const id = req.params.id;

        Maquina.findByIdAndRemove(id)
            .then(maq => {
                if (!maq) {
                    res.status(404).send({
                        message: `No se pudo borrar ninguna Maquina id=${id}. ¡Quizás no fue encontrada!`
                    });
                } else {
                    Gym.findByIdAndUpdate(gymID, { $pull: { 'maquinas': { $in: [id] } }, $inc: { 'nMaquinas': -1 } }, { multi: true })
                        .then(maq => {
                            if (!maq) {
                                res.status(404).send({
                                    message: `No se pudo remover Maquina con ${id} del Gym.`
                                });
                            } else {
                                res.send({
                                    message: "!Maquina borrada correctamente!"
                                });
                            }
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).send({
                                message: `Error al borrar Maquina del Gym.`
                            });
                        });
                }
            })
            .catch(err => {
                res.status(500).send({
                    message: "No se pudo borrar Maquina con id=" + id
                });
            });
    },
    //actualizar el estado
    findAllMaquinasLibres: (req, res) => {
        Maquina.find({ 'estado': false })
            .then(maqs => {
                res.send(maqs);
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Algún error ocurrió al recuperar Maquinas."
                });
            });
    },
    findAllMaquinasOcupadas: (req, res) => {
        Maquina.find({ 'estado': true })
            .then(maqs => {
                res.send(maqs);
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Algún error ocurrió al recuperar Maquinas."
                });
            });
    },
}

module.exports = controller;