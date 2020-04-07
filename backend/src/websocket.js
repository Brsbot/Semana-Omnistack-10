const socketio = require('socket.io');
const StringToArray = require('./controllers/util/SplitArray');
const dist = require('./controllers/util/CalculateDistance');

let io;
const connections = [];

exports.setupWebsocket = (server) => {
    io = socketio(server);

    io.on('connection', socket => {

        const { latitude, longitude, techs } = socket.handshake.query;

        connections.push({
            id: socket.id,
            coordinates: {
                latitude: Number(latitude),
                longitude: Number(longitude)
            },
            techs: StringToArray(techs),
        });

    });

};

exports.findConnections = (coordinates, techs) => {
    return connections.filter(connection => {
        return dist(coordinates, connection.coordinates) < 10 && connection.techs.some(item => techs.includes(item))
    });
};

exports.sendMessage = (to, message, data) => {
    to.forEach(connection => {
        io.to(connection.id).emit(message, data);
    })
};