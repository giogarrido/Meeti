const Sequelize = require('sequelize');
const db = require('../config/db');
const uuid = require('uuid');
const Categorias = require('./Categorias');
const Users = require('./Users');

const Grupos = db.define('grupos', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: uuid.v4()
    },
    nombre: {
        type: Sequelize.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El nombre del grupo es obligatorio'
            }
        }
    },
    descripcion: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'La descripción del grupo es obligatoria'
            }
        }
    },
    url: Sequelize.TEXT,
    imagen: Sequelize.TEXT

});

Grupos.belongsTo(Categorias);
Grupos.belongsTo(Users);

module.exports = Grupos;


