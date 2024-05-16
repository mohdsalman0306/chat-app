const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io')
const Filter = require('bad-words')

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

    socket.on('sendMessage', (msg, callback) => {
        const filter = new Filter()
        
        if(filter.isProfane(msg)) {
            return callback('Bad words are not allowed!')
        }

        io.emit('message', msg) // to emit to all connection
        callback('From Server ---> Delivered!')
    })

    socket.on('disconnect', () => {
        io.emit('message', 'A user has left')
    })

    socket.on('sendLocation', (coords, callback) => {
        socket.broadcast.emit('message', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
        callback()
    })
})

server.listen(port, () => {
    console.log(`Server is up and runnig at port ${port}!`)
})