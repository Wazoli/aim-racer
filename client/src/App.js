import React, { useState } from "react";

import Trainer from "./components/Trainer";
import Header from "./components/Header";
import Menu from './components/Menu';

function App() {
    const [missCount, setMissCount] = useState(0)
    const [score, setScore] = useState(0)
    const [streakCount, setStreakCount] = useState(0)
    const [showMenu, setShowMenu] = useState(false)
    const [numTargets, setNumTargets] = useState(5)
    const [targetSize, setTargetSize] = useState(50)

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
