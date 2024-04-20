const express = require('express');
const router = express.Router();

const homeController = require('../controllers/homeController');
const userController = require('../controllers/userController');

module.exports = function () {
    router.get('/', homeController.home);

    router.get('/crear-cuenta', userController.formCreateAccount);
    router.post('/crear-cuenta', userController.createAccount);

    //Inicio de sesion
    router.get('/iniciar-sesion', userController.formLogin);
    
    return router;
    
}