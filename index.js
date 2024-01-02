const express = require('express');
const path = require('path');
const app = express();
const morgan = require('morgan');
const { mongoose } = require('./db/connection')
const session = require('express-session');
const passport = require('passport');
require('./local-auth');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { v4: uuidv4 } = require('uuid');
//socket config
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const server = createServer(app);
const io = new Server(server);


//config
app.set('port', process.env.PORT || 3000)
app.set("view engine", "ejs")
app.set("views",path.join(__dirname,"views"))

app.use(express.static(path.join(__dirname, "assets")))

//Swagger
const options = {
  swaggerDefinition: {
    openapi: '3.0.0', // Especifica la versión de OpenAPI aquí
    info: {
      title: 'Mi API',
      version: '1.0.0',
      description: 'Descripción de mi API',
    },
  },
  apis: ['routes/*.js'], // Rutas de tus endpoints
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc(options)));

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
const notes = require('./routes/notes')
const chat = require('./routes/chat')
app.use('/', generalRoutes)
app.use('/notes', notes)
app.use('/chat', chat)

// Base de datos para el socket
const Message = require('./db/models/message')

//sockets
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  // Un usuario se une a una sala
  socket.on('room:join', async (data) => {
    try {
      console.log('room:join', data);
      socket.leaveAll();
      socket.join(data.conversation);
    } catch (error) {
      console.error('Error en room:join', error);
    }
  });

  // Un usuario envía un mensaje
  socket.on('message:send', async (data) => { 
    console.log('message:send', data);
    // Emitimos el mensaje a la sala excepto al usuario que lo envió
    socket.to(data.conversation).emit('message:sent', data);
  });

});

server.listen(app.get('port'), () => {
  console.log(`Server is running on port ${app.get('port')}`);
});
