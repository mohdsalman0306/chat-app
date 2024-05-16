const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3001
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

let count = 0;

io.on('connection', (socket) => {
    console.log('New web socket connection')

    socket.emit('countUpdated', count)

    socket.on('increment', () => {
        count++;
        // socket.emit('countUpdated', count) // this is only for the one client which is just clicking
        io.emit('countUpdated', count) // this is for all the client connect to this perticular server
    })

    socket.emit('message', 'Welcome!') // to emit to that particuler connection
    socket.broadcast.emit('message', 'A new user has joined') //to emit to everybody but not to this connection

    socket.on('sendMessage', (msg) => {
        io.emit('message', msg) // to emit to all connection
    })

    socket.on('disconnect', () => {
        io.emit('message', 'A user has left')
    })
})

server.listen(port, () => {
    console.log(`Server is up and runnig at port ${port}!`)
})