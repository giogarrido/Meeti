const Grupos = require("../models/Grupos");
const Meeti = require("../models/Meeti");
const moment = require("moment");
const { Op } = require("sequelize");

exports.panelAdmin = async (req, res) => {
  // consultas

  const consultas = [];
  consultas.push(Grupos.findAll({ where: { userId: req.user.id } }));
  consultas.push(
    Meeti.findAll({
      where: {
        userId: req.user.id,
        fecha: { [Op.gte]: moment(new Date()).format("YYYY-MM-DD") },
      },
    })
  );
  consultas.push(
    Meeti.findAll({
      where: {
        userId: req.user.id,
        fecha: { [Op.lt]: moment(new Date()).format("YYYY-MM-DD") },
      },
    })
  );

  // array destructuring
  const [grupos, meetis, anteriores] = await Promise.all(consultas);

  res.render("administracion", {
    nombrePagina: "Panel de Administracion",
    grupos,
    meetis,
    moment, // pasar función moment a la vista
    anteriores
  });
};
