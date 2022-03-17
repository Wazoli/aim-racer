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

    useEffect(() => {
        setSocket(io('http://localhost:4000/'))
    }, []);

    useEffect(() => {
        if(socket){
            socket.on('connect', (data) => {
                console.log('hello')
            })
            socket.on('opponentScoreUpdate', (data) =>{
                setOpponentScore(data.score)
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

    return (
        <div className="App">
            <Header setShowMenu = {setShowMenu} missCount = {missCount} score = {score} streakCount = {streakCount} />
            <ProgressBar player = {1} score = {score} />
            <ProgressBar player = {2} score = {opponentScore}/>
            <main className = 'flex-container main'>
                <Trainer score = {score} numTargets = {numTargets} targetSize = {targetSize} setMissCount = {setMissCount} setScore = {setScore} setStreakCount = {setStreakCount}/>
                {showMenu && <Menu numTargets = {numTargets} setNumTargets = {setNumTargets} targetSize = {targetSize} setTargetSize = {setTargetSize} />}
            </main>
        </div>
    );
}

export default App;
