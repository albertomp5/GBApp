const db = require("../models");
const Actividad = db.actividad;

checkDuplicateActividad = (req, res, next) => {
    // Nombre
    Actividad.findOne({
        nombre: req.body.nombre
    }).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (user) {
            res.status(400).send({ message: "¡Error! ¡La actividad ya existe!" });
            return;
        }
        next();
    });
};

checkAforo = (req, res, next) => {
    Actividad.findById(req.params.id)
        .exec((err, act) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            if (act.maxAforo == act.cliApuntados) {
                res.status(400).send({ message: "¡Error! Max. Aforo alcanzado!" });
                return;
            }
            next();
        });
};

checkUsuarioAlreadyApuntado = (req, res, next) => {
    Actividad.findById(req.params.id)
        .exec((err, act) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            if (act.usuarios.includes(req.body.userID)) {
                res.status(400).send({ message: "¡Error! ¡Usuario ya está apuntado!" });
                return;
            }
            next();
        });

};

checkUsuarioNoApuntado = (req, res, next) => {
    Actividad.findById(req.params.id)
        .exec((err, act) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            if (!act.usuarios.includes(req.body.userID)) {
                res.status(400).send({ message: "¡Error! ¡Usuario no está apuntado!" });
                return;
            }
            next();
        });

};


const verifyNewActividad = {
    checkDuplicateActividad,
    checkUsuarioAlreadyApuntado,
    checkAforo,
    checkUsuarioNoApuntado
};

module.exports = verifyNewActividad;