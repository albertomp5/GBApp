const fs = require('fs');
const uploadFile = require("../middlewares/upload");
var Usuario = require('../models/usuario');

const upload = async (req, res) => {
    try {
        await uploadFile(req, res);

        if (req.file == undefined) {
            return res.status(400).send({ message: "¡Seleccione una imagen para subir!" });
        } else {
            //actualizar el array de imagenes del usuario correspondiente
            var userID = req.params.id;
            console.log(req.file);
            Usuario.findByIdAndUpdate(userID, { $push: { 'imagenes': req.file.filename } }, { useFindAndModify: false })
                .then(user => {
                    if (!user) {
                        res.status(404).send({
                            message: `No se pudo actualizar Usuario con id=${userID}. ¡Quizás no fue encontrado!`
                        });
                    } else {
                        res.status(200).send({
                            message: "Imagen subida correctamente: " + req.file.originalname + " a " + user.nombre
                        });
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).send({
                        message: "Error actualizando Usuario con id=" + userID
                    });
                });
        }
    } catch (err) {
        console.log(err);

        if (err.code == "LIMIT_FILE_SIZE") {
            return res.status(500).send({
                message: "¡Imagen no puede pesar más de 2MB!",
            });
        }

        res.status(500).send({
            message: `No se pudo subir la imagen:${req.file.originalname}.${err} `,
        });
    }
};

const getListFiles = (req, res) => {
    const directoryPath = __basedir + "/upload/usuarios/";
    var userID = req.params.id;

    fs.readdir(directoryPath, function (err, files) {
        if (err) {
            res.status(500).send({
                message: "¡Incapaz de escanear imágenes!",
            });
        }
        else {
            let fileInfos = [];

            Usuario.findById(userID)
                .then(user => {
                    if (!user) {
                        res.status(404).send({ message: "No se encontro ningún usuario con id: " + userID })
                    }
                    else {
                        files.forEach((file) => {
                            user.imagenes.forEach((f) => {
                                if (file == f) {
                                    fileInfos.push({
                                        name: file,
                                        url: directoryPath + file,
                                    });
                                }
                            });
                        });
                        res.status(200).send(fileInfos);
                    }
                })
                .catch(err => {
                    console.log(err);
                    res
                        .status(500)
                        .send({ message: "Error recuperando Usuario con id=" + userID });
                });
        }
    });
};

const download = (req, res) => {
    const filename = req.params.name;
    const directoryPath = __basedir + "/upload/usuarios/";

    res.download(directoryPath + filename, filename, (err) => {
        if (err) {
            res.status(500).send({
                message: "Could not download the file. " + err,
            });
        }
    });
};

const deleteFile = (req, res) => {
    var userID = req.params.id;
    var filename = req.body.filename;

    Usuario.findByIdAndUpdate(userID, { $pull: { 'imagenes': { $in: [filename] } } }, { multi: true })
        .then(user => {
            if (!user) {
                res.status(404).send({
                    message: `No se puede borrar ${filename} de Usuario con id=${userID}. ¡Quizás el usuario no fue encontrado!`
                });
            } else {
                res.status(200).send({
                    message: "¡Imagen borrada correctamente!"
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({
                message: `Error borrando ${filename} de Usuario con id=` + userID
            });
        });
}


module.exports = {
    upload,
    getListFiles,
    download,
    deleteFile
};