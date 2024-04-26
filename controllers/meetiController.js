const Grupos = require('../models/Grupos');

// Muestra el formulario para nuevos meetis
exports.formNewMeeti = async (req, res) => {
    const grupos = await Grupos.findAll({ where: { userId: req.user.id } });

    res.render('nuevo-meeti', {
        nombrePagina: 'Crear Nuevo Meeti',
        grupos
    })
}