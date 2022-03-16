const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    }
});

let playerCount = 0
let roomAllocation = {};

io.on('connection', (socket) => {
    console.log(playerCount + ' joined')
    roomNo = Math.round(playerCount/2)
    socket.join(roomNo)
    roomAllocation[socket.id] = roomNo;
    socket.on('scoreUpdate', (data) => {
        socket.broadcast.to(roomAllocation[socket.id]).emit('serverScoreUpdate', data)
    })
})

server.listen(4000, () => {
    console.log("listening on *:3000");
});
