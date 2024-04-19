const Users = require('../models/Users');

exports.formCreateAccount = (req, res) => {
    res.render('crear-cuenta', {
        nombrePagina: 'Crea tu cuenta'
    });
};

exports.createAccount = async(req, res) => {
    const user = req.body;

const newUser = await Users.create(user);

console.log(newUser);
}