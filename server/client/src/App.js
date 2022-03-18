import React, { useState, useEffect } from "react";

import Trainer from "./components/Trainer";
import Header from "./components/Header";
import Menu from './components/Menu';
import ProgressBar from "./components/ProgressBar";

const { io } = require("socket.io-client");

function App() {
    const [missCount, setMissCount] = useState(0)
    const [score, setScore] = useState(0)
    const [streakCount, setStreakCount] = useState(0)
    const [showMenu, setShowMenu] = useState(false)
    const [numTargets, setNumTargets] = useState(5)
    const [targetSize, setTargetSize] = useState(50)
    const [socket, setSocket] = useState();
    const [opponentScore, setOpponentScore] = useState()
    const [roomNo, setRoomNo] = useState()
    const [currentRoom, setCurrentRoom] = useState()

    useEffect(() => {
        // setSocket(io('https://aimracer.herokuapp.com/'))
        setSocket(io('http://localhost:5000'))

    }, []);

    useEffect(() => {
        if(socket){
            socket.on('connect', (data) => {
                console.log('hello')
            })
            socket.on('opponentScoreUpdate', (data) =>{
                setOpponentScore(data.score)
            })
            socket.on('roomChanged', (data)=>{
                setCurrentRoom(data.room)
            })
        }
    }, [socket]);

    useEffect(() => {
        if(score && socket){
            socket.emit('scoreUpdate', {score : score})
        }
    }, [score, socket])

    useEffect(()=>{
        if(score > 10000){
            setScore(0)
            alert('game over, you win :)')
        }
        else if(opponentScore > 10000){
            setScore(0)
            alert('game over, you lose :(')
        }
    }, [score, opponentScore])

    useEffect(()=>{
        if(roomNo && socket){
            console.log(roomNo)
            socket.emit('roomRequest', {room : roomNo})
        }
    }, [roomNo, socket])

    return (
        <div className="App">
            <Header setShowMenu = {setShowMenu} missCount = {missCount} score = {score} streakCount = {streakCount} />
            <ProgressBar player = {1} score = {score} />
            <ProgressBar player = {2} score = {opponentScore}/>
            <main className = 'flex-container main'>
                <Trainer score = {score} numTargets = {numTargets} targetSize = {targetSize} setMissCount = {setMissCount} setScore = {setScore} setStreakCount = {setStreakCount}/>
                {showMenu && <Menu currentRoom = {currentRoom} roomNo = {roomNo} setRoomNo = {setRoomNo} numTargets = {numTargets} setNumTargets = {setNumTargets} targetSize = {targetSize} setTargetSize = {setTargetSize} />}
            </main>
        </div>
    );
}

export default App;
