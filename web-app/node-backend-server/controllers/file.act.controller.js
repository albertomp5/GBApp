const fs = require('fs');
const uploadFile = require("../middlewares/actFileUpload");
var Actividad = require('../models/actividad');

const upload = async (req, res) => {
    try {
        await uploadFile(req, res);

        if (req.file == undefined) {
            return res.status(400).send({ message: "¡Seleccione una imagen para subir!" });
        } else {
            //actualizar el array de imagenes del usuario correspondiente
            var actID = req.params.id;
            console.log(req.file);
            Actividad.findByIdAndUpdate(actID, { $push: { 'imagenes': req.file.filename } }, { useFindAndModify: false })
                .then(act => {
                    if (!act) {
                        res.status(404).send({
                            message: `No se pudo actualizar Actividad con id=${userID}. ¡Quizás no fue encontrada!`
                        });
                    } else {
                        res.status(200).send({
                            message: "Imagen subida correctamente: " + req.file.originalname + " a " + act.nombre
                        });
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).send({
                        message: "Error actualizando Actividad con id=" + actID
                    });
                });
        }
    } catch (err) {
        console.log(err);

        if (err.code == "LIMIT_FILE_SIZE") {
            return res.status(500).send({
                message: "Tamaño de imagen no puede superar 2MB!",
            });
        }

        res.status(500).send({
            message: `No se pudo subir la imagen:${req.file.originalname}.${err} `,
        });
    }
};

const getListFiles = (req, res) => {
    const directoryPath = __basedir + "/upload/actividades/";
    var actID = req.params.id;

    fs.readdir(directoryPath, function (err, files) {
        if (err) {
            res.status(500).send({
                message: "¡No se pudieron escánear las imágenes!",
            });
        }
        else {
            let fileInfos = [];

            Actividad.findById(actID)
                .then(act => {
                    if (!act) {
                        res.status(404).send({ message: "No se encontro ninguna Actividad con id: " + actID })
                    }
                    else {
                        files.forEach((file) => {
                            act.imagenes.forEach((f) => {
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
                        .send({ message: "Error recuperando Actividad con id=" + actID });
                });
        }
    });
};

const download = (req, res) => {
    const filename = req.params.name;
    const directoryPath = __basedir + "/upload/actividades/";

    res.download(directoryPath + filename, filename, (err) => {
        if (err) {
            res.status(500).send({
                message: "Could not download the file. " + err,
            });
        }
    });
};

/*const getImage = (req, res) => {
    const fileName = req.params.name;
    const directoryPath = __basedir + "/upload/usuarios/";

    fs.exists(filePath, (exists) => {
        if (exists) {
            return res.sendFile(path.resolve(filePath));
        } else {
            return res.status(404).send({
                status: "error",
                message: "la imagen no existe"
            });
        }
    });
},*/

const deleteFile = (req, res) => {
    var actID = req.params.id;
    var filename = req.body.filename;

    Actividad.findByIdAndUpdate(actID, { $pull: { 'imagenes': { $in: [filename] } } }, { multi: true })
        .then(act => {
            if (!act) {
                res.status(404).send({
                    message: `No se pudo eliminar ${filename} de Actividad con id=${actID}. ¡Quizás no fue encontrada!`
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
                message: `Error al borrar ${filename} de Actividad con id=` + actID
            });
        });
}


module.exports = {
    upload,
    getListFiles,
    download,
    deleteFile
};