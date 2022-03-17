const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
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
        let newRoom = 1000 - Object.keys(roomToPlayerCountMap).length;
        socket.join(newRoom);
        socketToRoomMap[socket.id] = newRoom;
        roomToPlayerCountMap[newRoom] = 1;
    }
    socket.emit("roomChanged", {room : Array.from(socket.rooms)[1]})
    console.log(Array.from(socket.rooms)[1]);
    socket.on("scoreUpdate", (data) => {
        socket.broadcast
            .to(socketToRoomMap[socket.id])
            .emit("opponentScoreUpdate", data);
    });
    socket.on('roomRequest', (data)=>{
        if(!roomToPlayerCountMap[data.room]){
            let currRoom = Array.from(socket.rooms)[1]
            roomToPlayerCountMap[currRoom] -= 1
            roomToPlayerCountMap[data.room] = 1
            console.log(roomToPlayerCountMap)
            socketToRoomMap[socket.id] = data.room
            socket.emit("roomChanged", data)
        }
        else if(roomToPlayerCountMap[data.room] < 2){
            let currRoom = Array.from(socket.rooms)[1]
            roomToPlayerCountMap[currRoom] -= 1
            socketToRoomMap[socket.id] = data.room
            roomToPlayerCountMap[data.room] += 1
            socket.emit("roomChanged", data)
        }
    })
    socket.on("disconnecting", () => {
        roomToPlayerCountMap[Array.from(socket.rooms)[1]] -= 1;
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
