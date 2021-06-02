'use strict'

const db = require("../models");
const Padel = db.padel;
const PadelBooking = db.padelbooking;

var controller = {
    getPadelData: (req, res) => {
        Padel.findById(padelID)
            .then(padel => {
                if (!padel)
                    res.status(404).send({ message: "No se encotró ningún Padel con id: " + padelID });
                else res.send(padel);
            })
            .catch(err => {
                res
                    .status(500)
                    .send({ message: "Error recuperando Padel con id=" + padelID });
            });
    },

    createBooking: (req, res) => {
        // Validate request
        if (!req.body.date) {
            res.status(400).send({ message: "¡Faltan datos!" });
            return;
        }

        var book = new PadelBooking({
            date: req.body.date,
            hora: req.body.hora,
            isBooked: true,
            usuario: req.body.userID,
        });

        book
            .save()
            .then(bk => {
                res.status(200).send({
                    message: "¡Reserva de pádel creada correctamente!",
                    bk
                });
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "¡Algún error ocurrió mientras se hacía la reserva!."
                });
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

        PadelBooking.findByIdAndUpdate(bookingID, { 'usuario': null, 'isBooked': false }, { new: true, useFindAndModify: false })
            .then(booking => {
                if (!booking) {
                    res.status(404).send({
                        message: `No se pudo actualizar la reserva id=${bookingID}. ¡Quizás no fue encontrada!`
                    });
                } else {
                    res.status(200).send({
                        message: "¡Reserva cancelada correctamente!",
                    });
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).send({
                    message: "Error mientras se cancelaba la reserva de Padel con id:" + bookingID + "del Usuario con id=" + userID
                });
            });
    },
    getAllBookingsInADay: (req, res) => {
        //console.log(req.params.date);
        var date = req.params.date.split(":");
        date = date[0] + "/" + date[1] + "/" + date[2];
        PadelBooking.find({ 'date': date }).sort('-_id').exec((err, bookings) => {
            if (err) {
                return res.status(500).send({
                    message: "¡Error en la red!"
                });

            } else if (!bookings) {
                return res.status(404).send({
                    message: "¡No se encontraron reservas de Padel este día!"
                });
            } else {
                return res.status(200).send({
                    bookings
                });
            }
        });
    },
    getAllUserBookings: (req, res) => {
        PadelBooking.find({ 'usuario': req.params.id }).sort('-_id').exec((err, bookings) => {
            if (err) {
                return res.status(500).send({
                    message: "¡Error en la red!"
                });

            } else if (!bookings) {
                return res.status(404).send({
                    message: "No se encotró ninguna reserva para el Usuario con id:" + req.params.id
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

        PadelBooking.findOne({'usuario': userID, 'date': date, 'hora': hour }).exec((err, book) => {
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
    updateEstadoActualPadel: () => {
        var date = new Date();
        var dia = date.getUTCDate();
        var mes = date.getUTCMonth() + 1;
        var año = date.getUTCFullYear();
        var hora = date.getHours().toString() + ":00";
        var fecha = dia.toString() + "/" + mes.toString() + "/" + año.toString();

        PadelBooking.findOne({ 'date': fecha, 'hora': hora }).exec((err, book) => {
            if (err) {
                console.log(err);
            } else if (!book) {
                Padel.findByIdAndUpdate(padelID, { 'isBookedNow': false, 'horario': fecha + "|" + hora }, { new: true, useFindAndModify: false })
                    .then(padel => {
                        console.log("!Padel actualizado correctamente!" + padel);
                    })
                    .catch(err => {
                        console.log(err);
                        console.log("¡Algún error ocurrió mientras se actualizaba el Padel!");
                    });
            } else {
                Padel.findByIdAndUpdate(padelID, { 'isBookedNow': true, 'horario': fecha + "|" + hora }, { new: true, useFindAndModify: false })
                    .then(padel => {
                        console.log("¡Padel actualizado correctamente!" + padel);
                    })
                    .catch(err => {
                        console.log(err);
                        console.log("¡Algún error ocurrió mientras se actualizaba el Padel!");
                    });
            }
        });
    },
    deleteCaducatedBooks: () => {
        var todaysDate = new Date();
        todaysDate.setHours(0, 0, 0, 0);

        PadelBooking.find({})
            .then(bookings => {
                bookings.forEach(booking => {
                    var dateSplits = booking.date.split("/");
                    var daySplit = dateSplits[0];
                    var monthSplit = dateSplits[1];
                    var yearSplit = dateSplits[2];
                    var bookingDay = new Date(yearSplit, monthSplit - 1, daySplit);
                    var bookingDayPlusOneWeek = bookingDay.getTime() + 604800000;  //+ 7 Days=604800000ms --> si quiero que duren una semana caducadas

                    //bookingDay --> bookingDayPlusOneWeek --> Registro de una semana caducadas hasta borrar
                    if (todaysDate > bookingDay) {
                        PadelBooking.findByIdAndRemove(booking._id)
                            .then(data => {
                                console.log("Reserva borrada del registro!");
                                console.log(data);
                            })
                            .catch(err => {
                                console.log(err.message || "Algún error ocurrió mintras se borraba Reserva de Padel con id:" + booking._id);
                            });
                    }
                });
            })
            .catch(err => {
                console.log(err.message || "Algun error ocurrió mientras se recuperaban las reservas de Padel.");
            });
    },
    deleteBooksWithoutUser: () => {
        PadelBooking.deleteMany({ 'isBooked': false }, function (err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log(result)
            }
        });
    },
}

module.exports = controller;