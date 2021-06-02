const db = require("../models");
const PadelBooking = db.padelbooking;

checkUserAlreadyBookThatTime = (req, res, next) => {
    PadelBooking.findOne({
        'date': req.body.date,
        'hora': req.body.hora,
        'isBooked': true
    }).exec((err, book) => {
        
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (book) {
            if (book.usuario.equals(req.body.userID)) {
                res.status(400).send({ message: "¡Error! ¡El Usuario ha reservado PADEL a esa hora!" });
                return;
            }
        }
        next();
    });
};

checkBookingDateIsCorrect = (req, res, next) => {
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

    if(diaActual == daySplit && mesActual == monthSplit && añoActual == yearSplit && parseInt(horaActual) >= parseInt(bookingHourSplit)){
        res.status(400).send({ message: "¡Permiso denegado! ¡No se puede reservar una hora pasada o la hora actual!" });
        return;
    }
    if(diaActual > daySplit && mesActual >= monthSplit && añoActual >= yearSplit){ 
        res.status(400).send({ message: "¡Permiso denegado! ¡No se puede reservar en un día ya transcurrido!" });
        return;
    }

    if (mesActual != monthSplit){
        res.status(400).send({ message: "¡Permiso denegado! ¡Sólo se puede reservar durante este mes!" });
        return;
    }

    if(añoActual != yearSplit){ 
        res.status(400).send({ message: "¡Permiso denegado! ¡Sólo se puede reservar durante este mes!" });
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


    if(diaActual == daySplit && mesActual == monthSplit && añoActual == yearSplit && parseInt(horaActual) >= parseInt(bookingHourSplit)){
        res.status(400).send({ message: "¡Permiso denegado! ¡No puedes cancelar una reserva de horas anteriores!" });
        return;
    }

    if((diaActual > daySplit && mesActual == monthSplit && añoActual == yearSplit) || mesActual > monthSplit || añoActual > yearSplit){ 
        res.status(400).send({ message: "¡Permiso denegado! ¡No puedes cancelar una reserva de días anteriores!" });
        return;
    }

    next();
};

checkHourIsAlreadyBooked = (req, res, next) => {
    PadelBooking.findOne({
        'date': req.body.date,
        'hora': req.body.hora
    }).exec((err, book) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (book) {
            if (book.isBooked === true) {
                res.status(400).send({ message: "¡Error! Padel está reservado! ¡Intente otra hora!" });
                return;
            }
        }
        next();
    });
};

const verifyBooking = {
    checkUserAlreadyBookThatTime,
    checkBookingDateIsCorrect,
    checkCancelBookingIsCorrect,
    checkHourIsAlreadyBooked
};

module.exports = verifyBooking;