const Categorias = require("../models/Categorias");
const Grupos = require("../models/Grupos");
const { body, validationResult } = require("express-validator");
const multer = require("multer");
const { where } = require("sequelize");
const shortid = require("shortid");
const fs = require("fs");

const configuracionMulter = {
  limits: { fileSize: 100000 },
  storage: (fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, __dirname + "/../public/uploads/grupos/");
    },
    filename: (req, file, cb) => {
      const extension = file.mimetype.split("/")[1]; //image/jpeg
      cb(null, `${shortid.generate()}.${extension}`);
    },
  })),
  fileFilter(req, file, cb) {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(new Error("Formato no válido"), false);
    }
  },
};

const upload = multer(configuracionMulter).single("imagen");

//subir imagen al servidor

exports.subirImagen = (req, res, next) => {
  upload(req, res, function (error) {
    if (error) {
      if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
          req.flash("error", "El archivo es muy grande: Máximo 100kb");
        } else {
          req.flash("error", error.message);
        }
      } else if (error.hasOwnProperty("message")) {
        req.flash("error", error.message);
      }
      res.redirect("back");
      return;
    } else {
      next();
    }
  });
};

exports.formNewGroup = async (req, res) => {
  const categorias = await Categorias.findAll();
  res.render("nuevo-grupo", {
    nombrePagina: "Crea un Nuevo Grupo",
    categorias,
  });
};

// Crear un nuevo grupo
exports.createGroup = async (req, res) => {
  // Sanitizar los campos

  body("*").trim().escape();

  console.log(req.body);
  const group = req.body;
  console.log(group);

  //Almacenar el usuario autenticado como el creador del grupo
  group.userId = req.user.id;

  //Leer la imagen
  if (req.file) {
    group.imagen = req.file.filename;
  }

  //Almacenar en la base de datos
  try {
    await Grupos.create(group);
    req.flash("exito", "Grupo creado correctamente");
    res.redirect("/administracion");
  } catch (error) {
    // const erroresSequelize = error.errors.map(err => err.message);
    console.log(error);
    req.flash("error", error);
    res.redirect("/nuevo-grupo");
  }
};

//Editar grupo
exports.formEditGroup = async (req, res) => {
  const consultas = [];
  consultas.push(Grupos.findByPk(req.params.id));
  consultas.push(Categorias.findAll());

  //Promise con await
  const [grupo, categorias] = await Promise.all(consultas);

  res.render("editar-grupo", {
    nombrePagina: `Editar Grupo: ${grupo.nombre}`,
    grupo,
    categorias,
  });
};

//Guardar los cambios en la base de datos
exports.editGroup = async (req, res, next) => {
  //Verificar que el grupo exista y sea el dueño
  const group = await Grupos.findOne({
    where: {
      id: req.params.id,
      userId: req.user.id,
    },
  });

  //Si no existe ese grupo o no es el dueño
  if (!group) {
    req.flash("error", "Operación no válida");
    res.redirect("/administracion");
    return next();
  }

  //Sanitizar los campos
  body("*").trim().escape();

  //Asignar los valores
  let { nombre, descripcion, categoriaId, url } = req.body;

  //Asignar los valores
  group.nombre = nombre;
  group.descripcion = descripcion;
  group.categoriaId = categoriaId;
  group.url = url;

  //Guardar los cambios
  await group.save();
  req.flash("exito", "Cambios almacenados correctamente");
  res.redirect("/administracion");
};

//Formulario para editar la imagen
exports.formEditImage = async (req, res) => {
  const grupo = await Grupos.findOne({
    where: { id: req.params.grupoId, userId: req.user.id },
  });
  res.render("imagen-grupo", {
    nombrePagina: `Editar Imagen Grupo: ${grupo.nombre}`,
    grupo,
  });
};

//Modificar la imagen en la base de datos y en el servidor
exports.editImage = async (req, res, next) => {
  const grupo = await Grupos.findOne({
    where: {
      id: req.params.grupoId,
      userId: req.user.id,
    },
  });

  //Si no existe ese grupo o no es el dueño
  if (!grupo) {
    req.flash("error", "Operación no válida");
    res.redirect("/administracion");
    return next();
  }

    //Si hay imagen anterior y nueva
    if (req.file && grupo.imagen) {
      const imagenAnteriorPath = __dirname + `/../public/uploads/grupos/${grupo.imagen}`;

      //Eliminar archivo con filesystem
      fs.unlink(imagenAnteriorPath, (error) => {
        if (error) {
          console.log(error);
        }
        return;
      });
    }

    //Si hay una imagen nueva
    if (req.file) {
      grupo.imagen = req.file.filename;
    }

    //Guardar en la base de datos
    await grupo.save();
    req.flash("exito", "Cambios almacenados correctamente");
    res.redirect("/administracion");
    
};
