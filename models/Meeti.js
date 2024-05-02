const Sequalize = require('sequelize');
const db = require('../config/db');
const slug = require('slug');
const uuid = require('uuid'); 
const shortid = require('shortid');

const Usuarios = require('./Users');
const Grupos = require('./Grupos');

const Meeti = db.define('meetis', {
    id: {
        type: Sequalize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: uuid.v4()
    },
    titulo: {
        type: Sequalize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Agrega un título'
            }
        }
    },
    slug: {
        type: Sequalize.STRING   
    },
    invitado: Sequalize.STRING,
    cupo: {
        type: Sequalize.INTEGER,
        defaultValue: 0
    },
    descripcion: {
        type: Sequalize.TEXT,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Agrega una descripción'
            }
        }
    },
    fecha: {
        type: Sequalize.DATEONLY,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Agrega una fecha para el Meeti'
            }
        }
    },
    hora: {
        type: Sequalize.TIME,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Agrega una hora para el Meeti'
            }
        }
    },
    direccion: {
        type: Sequalize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Agrega una dirección'
            }
        }
    },
    ciudad: {
        type: Sequalize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Agrega una ciudad'
            }
        }
    },
    estado: {
        type: Sequalize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Agrega un estado'
            }
        }
    },
    pais: {
        type: Sequalize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Agrega un país'
            }
        }
    },
    ubicacion: {
        type: Sequalize.GEOMETRY('POINT')
    },
    interesados: {
        type: Sequalize.ARRAY(Sequalize.INTEGER),
        defaultValue: []
    }
},{

    hooks: {
        async beforeCreate(meeti) {
            const url = slug(meeti.titulo).toLowerCase();
            meeti.slug = `${url}-${shortid.generate()}`;
        }
    }
    


});

Meeti.belongsTo(Usuarios);
Meeti.belongsTo(Grupos);



module.exports = Meeti;