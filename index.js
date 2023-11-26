const express = require('express');
const path = require('path');
const app = express();
const morgan = require('morgan');
const { mongoose } = require('./db/connection')
const session = require('express-session');
const passport = require('passport');
require('./local-auth');


//config
app.set('port', process.env.PORT || 3000)
app.set("view engine", "ejs")
app.set("views",path.join(__dirname,"views"))

app.use(express.static(path.join(__dirname, "assets")))

//middleware
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(morgan('dev'))
app.use(session({
    secret: 'DTSqzEjvT#ztLE&vSpQjXR8$!#iJ&$6pmbArZF9a!uT7*M^UJ$ztWC&r%e#8bt5Y',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

//routes
const generalRoutes = require('./routes/general')
app.use('/', generalRoutes)

app.listen(app.get('port'), () => {
  console.log(`Server is running on port ${app.get('port')}`);
});
