const express = require('express');
const path = require('path');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
const PORT = process.env.PORT || 3000;
let players = [];

app.use(express.static(path.join(__dirname, 'client/dist')));
app.set('views', path.join(__dirname, 'client/dist'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/game', function(req, res) {
    res.sendFile(path.join(__dirname + '/client/dist/index.html'));
});

io.on('connection', function (socket) {
    console.log('A user connected: ' + socket.id);

    players.push(socket.id);

    if (players.length === 1) {
        io.emit('isPlayerA');
    };

    if(players.length > 1) {
        io.emit('enableStart');
    };

    socket.on('dealCards', () => {
        io.emit('dealCards');
    });

    socket.on('cardPlayed', (gameObject, isPlayerA) => {
        io.emit('cardPlayed', gameObject, isPlayerA);
    });

    socket.on('disconnect', function () {
        console.log('A user disconnected: ' + socket.id);
        players = players.filter(player => player !== socket.id);
    });
});

server.listen(PORT, function () {
    console.log('Server started!');
});