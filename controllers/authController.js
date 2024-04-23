const passport = require("passport");

exports.login = passport.authenticate("local", {
    successRedirect: "/administracion",
    failureRedirect: "/iniciar-sesion",
    failureFlash: true,
    badRequestMessage: "Ambos campos son obligatorios",
});

// revisar si el usuario esta autenticado o no
exports.userAuthenticated = (req, res, next) => {
    // si el usuario esta autenticado, adelante
    if (req.isAuthenticated()) {
        return next();
    }

    // sino esta autenticado, redirigir al formulario
    return res.redirect("/iniciar-sesion");
};