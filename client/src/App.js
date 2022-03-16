import React, { useState, useEffect } from "react";

import Trainer from "./components/Trainer";
import Header from "./components/Header";
import Menu from './components/Menu';

const { io } = require("socket.io-client");

function App() {
    const [missCount, setMissCount] = useState(0)
    const [score, setScore] = useState(0)
    const [streakCount, setStreakCount] = useState(0)
    const [showMenu, setShowMenu] = useState(false)
    const [numTargets, setNumTargets] = useState(5)
    const [targetSize, setTargetSize] = useState(50)
    const [socket, setSocket] = useState();
    const [quarterUpdate, setQuarterUpdate] = useState(false)
    const [halfUpdate, setHalfUpdate] = useState(false)
    const [threeQuarterUpdate, setThreeQuarterUpdate] = useState(false)
    const [gameOverUpdate, setGameOverUpdate] = useState(false)

    useEffect(() => {
        setSocket(io('http://localhost:4000/'))
    }, []);

    useEffect(() => {
        if(socket){
            socket.on('connect', (data) => {
                console.log('hello')
            })
            socket.on('serverScoreUpdate', (data) =>{
                alert('they are ' + data.update + ' way through')
            })
        }
    }, [socket]);

    useEffect(() => {
        if(score > 2500 && !quarterUpdate){
            setQuarterUpdate(true)
        }
        if(score > 5000 && !halfUpdate){
            setHalfUpdate(true)
        }
        if(score > 7500 && !threeQuarterUpdate){
            setThreeQuarterUpdate(true)
        }
        if(score > 10000 && !gameOverUpdate){
            setGameOverUpdate(true)
        }

    }, [score])

    useEffect(() => {
        if(quarterUpdate){
            socket.emit('scoreUpdate', {update : 'quarter'})
        }
        if(halfUpdate){
            socket.emit('scoreUpdate', {update : 'half'})
        }
        if(threeQuarterUpdate){
            socket.emit('scoreUpdate', {update : 'threeQuarter'})
        }
        if(gameOverUpdate){
            socket.emit('scoreUpdate', {update : 'gameOver'})
        }
    }, [quarterUpdate, halfUpdate, threeQuarterUpdate, gameOverUpdate])

    return (
        <div className="App">
            <Header setShowMenu = {setShowMenu} missCount = {missCount} score = {score} streakCount = {streakCount} />
            <main className = 'flex-container main'>
                <Trainer numTargets = {numTargets} targetSize = {targetSize} setMissCount = {setMissCount} setScore = {setScore} setStreakCount = {setStreakCount}/>
                {showMenu && <Menu numTargets = {numTargets} setNumTargets = {setNumTargets} targetSize = {targetSize} setTargetSize = {setTargetSize} />}
            </main>
        </div>
    );
}

export default App;
