const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const path = require("path");
const router = require("./routes");

//Conectar a la base de datos
const db = require("./config/db");
require("./models/Users");
db.sync()
  .then(() => console.log("DB is connected"))
  .catch((error) => console.log(error));

require("dotenv").config({ path: "variables.env" });

//Crear una app de express
const app = express();

//Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//Habilitar EJS como template engine
app.use(expressLayouts);
app.set("view engine", "ejs");

//Ubucacion de las vistas
app.set("views", path.join(__dirname + "/views"));

//Archivos estaticos
app.use(express.static(path.join(__dirname + "/public")));

// Middleware (ususario logueado, flash messages, fecha actual, etc.)
app.use((req, res, next) => {
  const fecha = new Date();
  res.locals.year = fecha.getFullYear();
  next();
});

//Routing
app.use("/", router());

//Agrega el puerto
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
