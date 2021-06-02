const db = require("../models");
const Usuario = db.user;
const Matricula = db.matricula;

checkMatriculaAlreadyPaid = (req, res, next) => {
    Matricula.findOne({ 'usuario': req.params.id })
        .exec((err, mat) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            if (mat.isPaid == true) {
                res.status(409).send({ message: "¡Error! ¡El Usuario ya pagó!" });
                return;
            }
            next();
        });
};

checkUserHasntPaid = (req, res, next) => {
    Matricula.findOne({ 'usuario': req.body.userID })
        .exec((err, mat) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            else {
                if (mat.isPaid == false) {
                    res.status(402).send({ message: "¡Error! ¡El Usuario no pagó!" });
                    return;
                }
            }
            next();
        });
};

checkUsuarioApuntadoMuchasActividades = (req, res, next) => {
    Usuario.findById(req.body.userID)
        .exec((err, user) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            Matricula.findById(user.matricula)
                .exec((err2, mat) => {
                    if (err2) {
                        res.status(500).send({ message: err2 });
                        return;
                    }
                    if(mat.type == 1 && user.actividades.length > 2){
                        res.status(400).send({ message: "¡Error! ¡El Usuario superó el Nº máximo de actividades permitidas por su Matricula!" });
                        return;
                    }
                    else if(mat.type == 2 && user.actividades.length > 3){
                        res.status(400).send({ message: "¡Error! ¡El Usuario superó el Nº máximo de actividades permitidas por su Matricula!" });
                        return;
                    }
                });
            next();
        });
};

//checkUsuarioApuntadoAmuchasHorasDeGym

const verifyMatricula = {
    checkMatriculaAlreadyPaid,
    checkUsuarioApuntadoMuchasActividades,
    checkUserHasntPaid
};

module.exports = verifyMatricula;