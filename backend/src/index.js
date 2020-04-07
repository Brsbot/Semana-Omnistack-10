//importar biblioteca express
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const routes = require('./routes');
const { setupWebsocket } = require('./websocket');

//criando uma url; aplicação; servidor
const app = express();
const server = http.Server(app);

setupWebsocket(server);

//MongoDB (Não-relacional)
mongoose.connect('mongodb+srv://myself:mongouserd8y2@cluster0-brufl.mongodb.net/omnistack?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors()); //{origin: 'http://localhost:3000'}));
app.use(express.json());  //allows work with json
app.use(routes);



server.listen(3333); //localhost:3333 