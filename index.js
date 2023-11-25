
const express = require('express');
const path = require('path');
const app = express();
const morgan = require('morgan');


//config
app.set('port', process.env.PORT || 3000)
app.set("view engine", "ejs")
app.set("views",path.join(__dirname,"views"))

app.use(express.static(path.join(__dirname, "assets")))

//middleware
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(morgan('dev'))

//routes
app.get('/', (req, res) => {
  res.render('index')
})

app.listen(app.get('port'), () => {
  console.log(`Server is running on port ${app.get('port')}`);
});
