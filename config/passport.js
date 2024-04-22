const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/Users');

passport.use( new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await User.findOne({
            where: {
                email, activo : 1
            }
        });
        // El usuario existe, pero el password es incorrecto
        if (!user.verifyPassword(password)) {
            return done(null, false, {
                message: 'Password incorrecto'
            });
        }
        // El email existe y el password es correcto
        return done(null, user);

    } catch (error) {
        // Ese usuario no existe
        return done(null, false, {
            message: 'Esa cuenta no existe'
        });
    }
}
));

passport.serializeUser((user, callback) => {
    callback(null, user);
});

passport.deserializeUser((user, callback) => {
    callback(null, user);
});

module.exports = passport;
