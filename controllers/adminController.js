const Grupos = require('../models/Grupos');


exports.panelAdmin = async (req, res) => {
    const grupos = await Grupos.findAll({ where: { userId: req.user.id } });
    res.render('administracion', {
        nombrePagina: 'Panel de Administracion',
        grupos
    })
}
