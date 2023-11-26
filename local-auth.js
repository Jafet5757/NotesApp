const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('./db/models/user');

passport.serializeUser((user, done) => {
    done(null, user);
})

passport.deserializeUser(async (user, done) => {
    const userFinded = await User.findById(user._id);
    done(null, userFinded);
});

passport.use('local-signin', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
    }, async (req, email, password, done) => {
        //Comprobamos que está logueado
        const userFinded = await User.findOne({email});
        let match = false;
        if(userFinded){
            match = await userFinded.matchPasswords(password);
        }else{
            req.body.message = 'Acceso denegado';
            return done(null, false);
        }
        if(match){
            //Si tiene acceso, lo guardamos en la sesión
            return done(null, userFinded);
        }else{
            req.body.message = 'Acceso denegado';
            return done(null, false);
        }
    }
))