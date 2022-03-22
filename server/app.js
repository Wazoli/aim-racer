const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        // origin: 'https://aimracer.herokuapp.com/',
        methods: ["GET", "POST"],
    },
});

const path = require("path");
const port = process.env.PORT || 5000;

let playerCount = 0;
let socketToRoomMap = {};
let roomToPlayerCountMap = {};

io.on("connection", (socket) => {
    console.log(playerCount + " joined");
    let joinedRoom = false;
    for (const room in roomToPlayerCountMap) {
        if (roomToPlayerCountMap[room] < 2) {
            let newRoom = parseInt(room);
            socket.join(newRoom);
            socketToRoomMap[socket.id] = parseInt(newRoom);
            roomToPlayerCountMap[newRoom] += 1;
            joinedRoom = true;
            break;
        }
    }
    if (!joinedRoom) {
        let newRoom = 1000
        while(roomToPlayerCountMap[newRoom]){
            newRoom += 1
        }
        socket.join(newRoom);
        socketToRoomMap[socket.id] = newRoom;
        roomToPlayerCountMap[newRoom] = 1;
    }

    console.log('connected')
    console.log(roomToPlayerCountMap)

    socket.emit("roomChanged", {room : socketToRoomMap[socket.id]})

    socket.on("scoreUpdate", (data) => {
        socket.broadcast
            .to(socketToRoomMap[socket.id])
            .emit("opponentScoreUpdate", data);
    });

    socket.on('roomRequest', (data)=>{
        console.log('before room change')
        console.log(roomToPlayerCountMap)
        currRoom = socketToRoomMap[socket.id]
        if(!roomToPlayerCountMap[data.room]){
            roomToPlayerCountMap[currRoom] -= 1
            roomToPlayerCountMap[data.room] = 1
            socketToRoomMap[socket.id] = data.room
            socket.join(data.room)
            socket.emit("roomChanged", data)
        }
        else if(roomToPlayerCountMap[data.room] < 2){
            roomToPlayerCountMap[currRoom] -= 1
            socketToRoomMap[socket.id] = data.room
            roomToPlayerCountMap[data.room] += 1
            socket.join(data.room)
            socket.emit("roomChanged", data)
        }
        console.log('after room change')
        console.log(roomToPlayerCountMap)
    })

    socket.on('playerReady', (data)=>{
        socket.broadcast
            .to(socketToRoomMap[socket.id])
            .emit("playerReady", data);
    })

    socket.on('confirmReady', (data)=>{
        socket.broadcast
            .to(socketToRoomMap[socket.id])
            .emit("confirmReady", data);
    })

    socket.on('changeTargetSize', (data)=>{
        socket.broadcast.to(socketToRoomMap[socket.id]).emit('changeTargetSize', data)
    })

    socket.on('changeNumTargets', (data)=>{
        socket.broadcast.to(socketToRoomMap[socket.id]).emit('changeNumTargets', data)
    })

    socket.on("disconnecting", () => {
        roomToPlayerCountMap[socketToRoomMap[socket.id]] -= 1;
        console.log('disconnecting')
        console.log(roomToPlayerCountMap)
    });

    socket.on("disconnect", () => {  
        delete socketToRoomMap[socket.id];
    });
    playerCount++;
});

httpServer.listen(port, () => {
    console.log("listening on " + port);
});

app.use(express.static(path.join(__dirname, "/client/build")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/client/build", "index.html"));
});
