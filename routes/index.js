const express = require('express');
const router = express.Router();

const homeController = require('../controllers/homeController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');
const groupController = require('../controllers/groupController');

module.exports = function () {
    router.get('/', homeController.home);

    router.get('/crear-cuenta', userController.formCreateAccount);
    router.post('/crear-cuenta', userController.createAccount);
    router.get('/confirmar-cuenta/:email', userController.confirmAccount);

    //Inicio de sesion
    router.get('/iniciar-sesion', userController.formLogin);
    router.post('/iniciar-sesion', authController.login);

    //Panel de administracion
    router.get('/administracion', authController.userAuthenticated, adminController.panelAdmin);

    //Nuevos grupos

    router.get('/nuevo-grupo', authController.userAuthenticated, groupController.formNewGroup);

    router.post('/nuevo-grupo', groupController.subirImagen, groupController.createGroup);


    
    return router;
    
}