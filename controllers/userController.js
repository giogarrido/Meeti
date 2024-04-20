const Users = require('../models/Users');
const { body, validationResult } = require("express-validator");

exports.formCreateAccount = (req, res) => {
    res.render('crear-cuenta', {
        nombrePagina: 'Crea tu cuenta'
    });
};

exports.createAccount = async(req, res) => {
    const user = req.body;

    const rules = [
        body('nombre').escape(),
        body('email').isEmail().withMessage('Agrega un correo valido').escape(),
        body('password').not().isEmpty().withMessage('El campo password no puede ir vacio').escape(),
        body('confirmar').not().isEmpty().withMessage('El campo confirmar password no puede ir vacio').escape(),
        body('confirmar').equals(user.password).withMessage('Los passwords no son iguales').escape()
    ];

    await Promise.all(rules.map(validation => validation.run(req)));

    const errorsExpress = validationResult(req);


    console.log(errorsExpress);

    if (!errorsExpress.isEmpty()) {
        req.flash('error', errorsExpress.array().map(err => err.msg));
        res.redirect('/crear-cuenta');
        return;
    }

    try {
        const newUser = await Users.create(user);
        req.flash('exito', 'Hemos enviado un E-mail, confirma tu cuenta');
        res.redirect('/iniciar-sesion');
    } catch (error) {

        const errorsSequelize = error.errors.map(err => err.message);

        req.flash('error', errorsSequelize);
        res.redirect('/crear-cuenta');
    }

}

exports.formLogin = (req, res) => {
    res.render('iniciar-sesion', {
        nombrePagina: 'Iniciar sesión'
    });
};