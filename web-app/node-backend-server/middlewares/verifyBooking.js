const db = require("../models");
const Booking = db.booking;
const Usuario = db.user;
const Matricula = db.matricula;

checkUserAlreadyBookThatTime = (req, res, next) => {
    Booking.findOne({
        'date': req.body.date,
        'hora': req.body.hora
    }).exec((err, book) => {
        
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (book) {
            if (book.usuarios.includes(req.body.userID)) {
                res.status(400).send({ message: "¡Error! ¡Usuario ya reservo GYM a esa hora!" });
                return;
            }
        }
        next();
    });
};

checkAforo = (req, res, next) => {
    Booking.findOne({
        'date': req.body.date,
        'hora': req.body.hora
    }).exec((err, book) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (book) {
            if (book.maxBooks == book.actualBooks) {
                res.status(400).send({ message: "¡Error! ¡Aforo completo durante esa hora! ¡Intente otra hora!" });
                return;
            }
        }
        next();
    });
};

checkNBooksCorrect = (req, res, next) => {
    Usuario.findById(req.body.userID)
        .exec((err, user) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            if (user) {
                Matricula.findById(user.matricula)
                    .exec((err2, mat) => {
                        if (err2) {
                            res.status(500).send({ message: err2 });
                            return;
                        }
                        if (mat.type == 1 && user.nBooks == 3) {
                            res.status(400).send({ message: "¡Error! ¡El Usuario superó el Nº de reservas permitidas por su Matricula!" });
                            return;
                        }
                        else if (mat.type == 2 && user.nBooks == 4) {
                            res.status(400).send({ message: "¡Error! ¡El Usuario superó el Nº de reservas permitidas por su Matricula!" });
                            return;
                        }
                        next();
                    });
            }
        });
};
checkBookingDateIsCorrect = (req, res, next) => {
    var date = new Date();
    var hora = date.getHours().toString()+":00";
    var h= date.getHours();
    var horaSplits = hora.split(":");
    var horaActual = horaSplits[0];
    var diaActual = date.getUTCDate();
    var mesActual = date.getUTCMonth()+1;
    var añoActual = date.getUTCFullYear();
    var bookingHour = req.body.hora;
    var bookingHourSplits = bookingHour.split(":");
    var bookingHourSplit = bookingHourSplits[0];
    var bookingDay = req.body.date;
    var dateSplits = bookingDay.split("/");
    var daySplit = dateSplits[0]; 
    var monthSplit = dateSplits[1]; 
    var yearSplit = dateSplits[2];  

    if(diaActual == daySplit && mesActual == monthSplit && añoActual == yearSplit && parseInt(horaActual) >= parseInt(bookingHourSplit)){
        res.status(400).send({ message: "¡Permiso denegado! ¡No se puede reservar una hora pasada o la hora actual!" });
        return;
    }
    if(diaActual > daySplit && mesActual >= monthSplit && añoActual >= yearSplit){ 
        res.status(400).send({ message: "¡Permiso denegado! ¡No se puede reservar en un día que ya ha pasado!" });
        return;
    }

    if (mesActual != monthSplit){
        res.status(400).send({ message: "¡Permiso denegado! ¡Sólo se puede reservar en el mes actual!" });
        return;
    }

    if(añoActual != yearSplit){ 
        res.status(400).send({ message: "¡Permiso denegado! ¡Sólo se puede reservar en el año actual!" });
        return;
    }

    next();
};


checkCancelBookingIsCorrect = (req, res, next) => {
    var date = new Date();
    var hora = date.getHours().toString()+":00";
    var horaSplits = hora.split(":");
    var horaActual = horaSplits[0];
    var diaActual = date.getUTCDate();
    var mesActual = date.getUTCMonth()+1;
    var añoActual = date.getUTCFullYear();
    var bookingHour = req.body.hora;
    var bookingHourSplits = bookingHour.split(":");
    var bookingHourSplit = bookingHourSplits[0];
    var bookingDay = req.body.date;
    var dateSplits = bookingDay.split("/");
    var daySplit = dateSplits[0]; 
    var monthSplit = dateSplits[1]; 
    var yearSplit = dateSplits[2]; 

    console.log(horaActual);
    console.log(bookingHourSplit);

    if(diaActual == daySplit && mesActual == monthSplit && añoActual == yearSplit && parseInt(horaActual) >= parseInt(bookingHourSplit)){
        res.status(400).send({ message: "¡Permiso denegado! ¡No se puede cancelar una reserva de una hora pasada o la hora actual!" });
        return;
    }

    if((diaActual > daySplit && mesActual == monthSplit && añoActual == yearSplit) || mesActual > monthSplit || añoActual > yearSplit){ 
        res.status(400).send({ message: "¡Permiso denegado! ¡No se puede cancelar una reserva de un día transucurrido!" });
        return;
    }

    next();
};

const verifyBooking = {
    checkAforo,
    checkUserAlreadyBookThatTime,
    checkNBooksCorrect,
    checkBookingDateIsCorrect,
    checkCancelBookingIsCorrect
};

module.exports = verifyBooking;