const { body } = require('express-validator');
const Grupos = require('../models/Grupos');
const Meeti = require('../models/Meeti');

// Muestra el formulario para nuevos meetis
exports.formNewMeeti = async (req, res) => {
    const grupos = await Grupos.findAll({ where: { userId: req.user.id } });

    res.render('nuevo-meeti', {
        nombrePagina: 'Crear Nuevo Meeti',
        grupos
    })
}

// Guarda los meetis en la base de datos

exports.createMeeti = async (req, res) => {
    // Leer los datos
    const meeti = req.body;

    // Asignar el usuario
    meeti.userId = req.user.id;

    // Almacenar la ubicacion con un point
    const point = { type: 'Point', coordinates: [parseFloat(req.body.lat), parseFloat(req.body.lng)] };
    meeti.ubicacion = point;

    // Cupo opcional
    if (req.body.cupo === '') {
        meeti.cupo = 0;
    }

    console.log(meeti);

    // Almacenar en la base de datos
    try {
        await Meeti.create(meeti);
        req.flash('exito', 'Meeti creado correctamente');
        res.redirect('/administracion');
    } catch (error) {
        // Extraer el message de los errores
        //const erroresSequelize = error.errors.map(err => err.message);

        req.flash('error', erroresSequelize);
        res.redirect('/nuevo-meeti');
    }
}

// Sanitizar los meetis
exports.sanitizeMeeti = (req, res, next) => {

    body('titulo').trip.escape();
    body('invitado').trip.escape();
    body('cupo').trip.escape();
    body('fecha').trip.escape();
    body('hora').trip.escape();
    body('direccion').trip.escape();
    body('ciudad').trip.escape();
    body('estado').trip.escape();
    body('pais').trip.escape();
    body('lat').trip.escape();
    body('lng').trip.escape();
    body('grupoId').trip.escape();
    
    next();
}