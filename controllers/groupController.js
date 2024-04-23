const Categorias = require('../models/Categorias');
const Grupos = require('../models/Grupos');
const { body, validationResult } = require("express-validator");


exports.formNewGroup = async(req, res) => {
    const categorias = await Categorias.findAll();
    res.render('nuevo-grupo', {
        nombrePagina: 'Crea un Nuevo Grupo',
        categorias
    });
}

exports.createGroup = async(req, res) => {
    // Sanitizar los campos
    const rules = [
        body('nombre').escape(),
        body('url').escape(),
        body('descripcion').escape()
    ];
    await Promise.all(rules.map((validation) => validation.run(req)));

    const group = req.body;

    //Almacenar el usuario autenticado como el creador del grupo
    group.userId = req.user.id;


    //Almacenar la url
    group.url = group.url.replace(/\s+/g, '-').toLowerCase();



    //Almacenar en la base de datos
    try {
        await Grupos.create(group);
        req.flash('exito', 'Grupo creado correctamente');
        res.redirect('/administracion');
    } catch (error) {
        // const erroresSequelize = error.errors.map(err => err.message);
        console.log(error);
        req.flash('error', error);
        res.redirect('/nuevo-grupo');
    }
}