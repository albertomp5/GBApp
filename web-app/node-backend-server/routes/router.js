'use strict'

const express = require('express');

//verify
const { verifySignUp } = require("../middlewares");
const { authJwt } = require("../middlewares");
const { verifyNewActividad } = require("../middlewares");
const { verifyMatricula } = require("../middlewares");
const { verifyBooking } = require("../middlewares");
const { verifyPadelBooking } = require("../middlewares");

//Controllers
const actController = require('../controllers/actividad');
const userController = require('../controllers/usuario');
const controller = require("../controllers/auth");
const gymController = require('../controllers/gym.controller');
const padelController = require('../controllers/padel.controller');
const fileController = require("../controllers/file.controller");
const fileActController = require("../controllers/file.act.controller");
const {
    resetPasswordRequestController,
    resetPasswordController,
  } = require("../controllers/pass.forgot.controller");

//cron
const cron = require('node-cron');


const router = express.Router();

//ruta de prueba
router.get('/test-user', userController.test);

//rutas auth
router.post('/auth/signup', [
    verifySignUp.checkDuplicateEmail,
    verifySignUp.checkRolesExisted
],
    controller.signup);
router.post('/auth/signin', controller.signin);
router.post('/auth/request-reset-password/', resetPasswordRequestController);
router.post("/auth/reset-password", resetPasswordController);

//rutas user
router.get("/test/all", userController.allAccess);
router.get("/test/user", [authJwt.verifyToken], userController.userBoard);
router.get("/test/user-data/:id", [authJwt.verifyToken], userController.getUserData);
router.put("/test/update-user-data/:id", userController.updateUserData);  
router.get(         //encontrarYActualizarUsuarioEspecificoPorID
    "/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    userController.adminBoard
);
router.delete('/test/delete-user/:id', [verifySignUp.checkUserIsAlreadyAdmin, authJwt.verifyToken, authJwt.isAdmin], userController.deleteUser);    //encontrarYBorrarUsuarioEspecificoPorID
router.get('/test/get-users', [authJwt.verifyToken, authJwt.isAdmin], userController.getUsers);  //listarUsuarios
router.get('/test/get-user/:id',[authJwt.verifyToken, authJwt.isAdmin], userController.getUser);    //encontrarUsuarioEspecificoPorID 
router.get('/test/search-user/:search', [authJwt.verifyToken, authJwt.isAdmin], userController.searchUser);    //buscarUnUsuarioPorAtributo
router.put('/test/hacer-admin/:id', [authJwt.verifyToken, authJwt.isAdmin, verifySignUp.checkUserIsAlreadyAdmin], userController.hacerAdmin); //comprobar q sea ya admin 

//rutas user matricula
router.post('/test/pagar-matricula/:id', [verifyMatricula.checkMatriculaAlreadyPaid] , userController.pagarMatricula); //comprobar este ya pagada
cron.schedule('0 0 0 1 * *', () => {
    //cada dia 1 de cada mes a las 00:00 actualizar el campo isPaid de todas las matriculas a false
    userController.actualizarMatriculas(); 
});
router.get('/test/mpaid/:id',  userController.mPaid);
router.get('/test/get-user-matricula/:id', [authJwt.verifyToken, authJwt.isAdmin], userController.getMatricula);
//con un cron poner nBooks de cada usuario a 0 cada domingo
cron.schedule('0 0 0 * * Sun', () => {
    userController.updateNBooks();
});

//rutas user file
router.post("/test/upload-user-images/:id", fileController.upload); //pasar id para saber q usuario ha subido cada imagen
router.get("/test/get-user-images/:id", fileController.getListFiles);  //coger solo las imagenes q estan en el array de imagenes del usuario
router.get("/test/download-file/:name", fileController.download);   //descargar una imagen
router.put("/test/delete-user-file/:id", fileController.deleteFile);   //borrar una imagen una imagen

//rutas actividad
router.post("/act/new-actividad", [verifyNewActividad.checkDuplicateActividad] ,actController.create);
router.get("/act/get-actividades", actController.getAllActividades);
router.get("/act/get-actividad/:id", actController.getActividad);
router.put("/act/apuntar-actividad/:id", [verifyNewActividad.checkUsuarioAlreadyApuntado, verifyNewActividad.checkAforo, verifyMatricula.checkUserHasntPaid, verifyMatricula.checkUsuarioApuntadoMuchasActividades], actController.apuntarActividad);
router.put("/act/desapuntar-actividad/:id",[verifyNewActividad.checkUsuarioNoApuntado], actController.desapuntarActividad); 
router.delete("/act/delete-actividad/:id", [authJwt.verifyToken, authJwt.isAdmin], actController.deleteAct);
router.get('/act/search-actividad/:search', actController.searchActividad);    //buscarUnaActividadPorAtributo

//rutas actividad file
router.post("/act/upload-actividad-images/:id", fileActController.upload); //pasar id para saber q usuario ha subido cada imagen
router.get("/act/get-actividad-images/:id", fileActController.getListFiles);  //coger solo las imagenes q estan en el array de imagenes del usuario
router.get("/act/download-file/:name", fileActController.download);   //descargar una imagen (en desuso)
router.put("/act/delete-actividad-file/:id",fileActController.deleteFile);   //borrar una imagen una imagen

//rutas reseña
router.post("/act/new-resenha", actController.createReseña);
router.get("/act/get-resenhas/:id", actController.getAllReseñas);
router.delete("/act/delete-resenha/:id", actController.deleteReseña);
router.put("/act/update-resenha-votos/:id", actController.updateVotosFromReseña);

//rutas gym y maquina
router.get("/gym/get-gym-data", gymController.getGymData);
router.post("/gym/new-maquina", gymController.createMaquina); //comprobar maquina duplicada
router.get("/gym/get-maquinas", gymController.getMaquinas);
router.get("/gym/get-maquina/:id", gymController.getMaquina);
router.delete("/gym/delete-maquina/:id", gymController.deleteMaquina);
router.get("/gym/get-maquinas-libres", gymController.getMaquinas);
router.get("/gym/get-maquinas-ocupadas", gymController.getMaquinas);
router.post("/gym/new-booking", [verifyBooking.checkAforo, verifyBooking.checkUserAlreadyBookThatTime, verifyBooking.checkNBooksCorrect, verifyBooking.checkBookingDateIsCorrect ,verifyMatricula.checkUserHasntPaid, verifyPadelBooking.checkUserAlreadyBookThatTime], gymController.createBooking);
router.get("/gym/get-bookings/:date", gymController.getAllBookingsInADay);
router.get("/gym/get-user-bookings/:id", gymController.getAllUserBookings);
router.put("/gym/cancel-booking/", [verifyBooking.checkCancelBookingIsCorrect], gymController.cancelBooking);
router.post("/gym/check-user-has-gym-hour-now", gymController.checkUserHasHourBookedNow);
//cron cada hora para actualizar aforoActual del gimnasio con actualBooks de la reserva correspondiente a esa hora
//comprobar si hay reserva primero, si hay se actualiza si no aforoActual del gimnasio pasa a 0
cron.schedule('0 0 */1 * * *', () => { //'0 0 */1 * * *'
    gymController.updateAforoActualGym();
});
//con un cron cada dia borrar las reservas caducadas
cron.schedule('00 00 12 * * 0-6', () => {  
    gymController.deleteCaducatedBooks();
});
//con un cron borrar las reservas que tengan actualBooks a 0 cada media hora
cron.schedule('0 */30 * * * *', () => {  
    gymController.deleteBooksWithoutUsers();
});

//rutas padel
router.get("/padel/get-padel-data", padelController.getPadelData);
router.post("/padel/new-padel-booking", [verifyPadelBooking.checkUserAlreadyBookThatTime, verifyPadelBooking.checkHourIsAlreadyBooked, verifyPadelBooking.checkBookingDateIsCorrect, verifyMatricula.checkUserHasntPaid, verifyBooking.checkUserAlreadyBookThatTime], padelController.createBooking); 
router.get("/padel/get-padel-bookings/:date", padelController.getAllBookingsInADay);
router.get("/padel/get-user-padel-bookings/:id", padelController.getAllUserBookings);
router.put("/padel/cancel-padel-booking/", [verifyPadelBooking.checkCancelBookingIsCorrect], padelController.cancelBooking);
router.post("/padel/check-user-has-padel-hour-now", padelController.checkUserHasHourBookedNow);
//cron cada hora para actualizar aforoActual del gimnasio con actualBooks de la reserva correspondiente a esa hora
//comprobar si hay reserva primero, si hay se actualiza si no aforoActual del gimnasio pasa a 0
cron.schedule('0 0 */1 * * *', () => { 
    padelController.updateEstadoActualPadel();
});
//con un cron cada dia borrar las reservas caducadas
cron.schedule('00 00 12 * * 0-6', () => {  //00 00 12 * * 0-6
    padelController.deleteCaducatedBooks();
});
//con un cron borrar las reservas que tengan isBooked a false cada media hora
cron.schedule('0 */30 * * * *', () => {  
    padelController.deleteBooksWithoutUser();
});

module.exports = router;