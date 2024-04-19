const Sequelize = require('sequelize');
const db = require('../config/db');
const bcrypt = require('bcrypt-nodejs');

const Users = db.define('users', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El nombre no puede ir vacio'
            }
        }
    },
    imagen: Sequelize.STRING(60),
    email: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            isEmail: {
                msg: 'Agrega un correo valido'
            },
            notEmpty: {
                msg: 'El email no puede ir vacio'
            }
        },
        unique: {
            args: true,
            msg: 'Usuario ya registrado'
        }
    },
    password: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El password no puede ir vacio'
            }
        }
    },
    token: Sequelize.STRING,
    expiracion: Sequelize.DATE,
    activo: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    tokenPassword: Sequelize.STRING,
    expiraToken: Sequelize.DATE

}, {
    hooks: {
        beforeCreate(user) {
            user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
        }
    }
});

//Metodos personalizados

//Verificar si el password enviado es igual al password de la base de datos
Users.prototype.validarPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

module.exports = Users;