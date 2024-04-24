const Categorias = require('../models/Categorias');
const Grupos = require('../models/Grupos');
const { body, validationResult } = require("express-validator");
const multer = require('multer');
const shortid = require('shortid');

const configuracionMulter = {
    limits: { fileSize: 600000 },
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, __dirname + '/../public/uploads/grupos/');
        },
        filename: (req, file, cb) => {
            const extension = file.mimetype.split('/')[1]; //image/jpeg
            cb(null, `${shortid.generate()}.${extension}`);
        }
    }),
    fileFilter(req, file, cb) {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(new Error('Formato no válido'));
        }
    }
}

const upload = multer(configuracionMulter).single('imagen');

//subir imagen al servidor

exports.subirImagen = (req, res, next) => {
    upload(req, res, function(error) {
        if (error) {
            if (error instanceof multer.MulterError) {
                if (error.code === 'LIMIT_FILE_SIZE') {
                    req.flash('error', 'El archivo es muy grande: Máximo 100kb');
                } else {
                    req.flash('error', error.message);
                }
            } else if (error.hasOwnProperty('message')) {
                req.flash('error', error.message);
            }
            res.redirect('back');
            return;
        } else {
            next();
        }
    });

}

exports.formNewGroup = async(req, res) => {
    const categorias = await Categorias.findAll();
    res.render('nuevo-grupo', {
        nombrePagina: 'Crea un Nuevo Grupo',
        categorias
    });
}

// Crear un nuevo grupo
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

    //Leer la imagen
    if (req.file) {
        group.imagen = req.file.filename;
    }


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


