import React, { useState, useEffect } from "react";

import Trainer from "./components/Trainer";
import Header from "./components/Header";
import Menu from "./components/Menu";
import ProgressBar from "./components/ProgressBar";

const { io } = require("socket.io-client");

function App() {
    const [missCount, setMissCount] = useState(0);
    const [score, setScore] = useState(0);
    const [streakCount, setStreakCount] = useState(0);
    const [showMenu, setShowMenu] = useState(false);
    const [numTargets, setNumTargets] = useState(5);
    const [targetSize, setTargetSize] = useState(50);
    const [socket, setSocket] = useState();
    const [opponentScore, setOpponentScore] = useState();
    const [roomNo, setRoomNo] = useState();
    const [currentRoom, setCurrentRoom] = useState();
    const [playerReady, setPlayerReady] = useState(false);
    const [opponentReady, setOpponentReady] = useState(false);
    const [gameStarted, setGameStarted] = useState();
    const [readyState, setReadyState] = useState();

    useEffect(() => {
        // setSocket(io('https://aimracer.herokuapp.com/'))
        setSocket(io("http://localhost:5000"));
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on("connect", (data) => {
                console.log("hello");
            });
            socket.on("opponentScoreUpdate", (data) => {
                setOpponentScore(data.score);
            });
            socket.on("roomChanged", (data) => {
                setCurrentRoom(data.room);
                setGameStarted(false);
                setOpponentReady(false);
                setPlayerReady(false);
            });
            socket.on("playerReady", (data) => {
                if (!gameStarted) {
                    setOpponentReady(data.playerReady);
                }
            });
            socket.on("confirmReady", (data) => {
                setOpponentReady(true);
            });
        }
    }, [socket]);

    useEffect(() => {
        if (score !== undefined && socket) {
            socket.emit("scoreUpdate", { score: score });
        }
    }, [score, socket]);

    useEffect(() => {
        if (roomNo && socket) {
            console.log(roomNo);
            socket.emit("roomRequest", { room: roomNo });
        }
    }, [roomNo, socket]);

    useEffect(() => {
        if (socket && !gameStarted) {
            socket.emit("playerReady", { playerReady: playerReady });
        }
    }, [playerReady, socket, gameStarted]);

    useEffect(() => {
        if (score > 10000) {
            setReadyState("Game Over, You Win :)");
        } else if (opponentScore > 10000) {
            setReadyState("Game Over, You Lose :(");
        }
        if (score > 10000 || opponentScore > 10000) {
            setScore(0);
            setGameStarted(false);
            setTimeout(() => {
                setPlayerReady(false);
                setOpponentReady(false);
            }, 3000);
        }
    }, [score, opponentScore]);

    useEffect(() => {
        if (!playerReady) {
            setReadyState("Ready");
        } else if (playerReady && !opponentReady) {
            setReadyState("Waiting...");
        } else if (playerReady && opponentReady) {
            let time = 3;
            let countdown = setInterval(() => {
                if (time === 0) {
                    setGameStarted(true);
                    clearInterval(countdown);
                } else {
                    setReadyState(time);
                    time--;
                }
            }, 1000);
        }
    }, [playerReady, opponentReady]);

    useEffect(() => {
        if (playerReady === true && opponentReady === true) {
            console.log("confirming");
            socket.emit("confirmReady", {
                playerReady: playerReady,
            });
        }
    }, [playerReady, opponentReady]);

    console.log("player");
    console.log(playerReady);
    console.log("opponent");
    console.log(opponentReady);

    return (
        <div className="App">
            <div className="header-container">
                <Header
                    setShowMenu={setShowMenu}
                    missCount={missCount}
                    score={score}
                    streakCount={streakCount}
                />
            </div>
            <ProgressBar player={1} score={score} />
            <ProgressBar player={2} score={opponentScore} />
            <main className="flex-container main">
                <Trainer
                    readyState={readyState}
                    gameStarted={gameStarted}
                    opponentScore={opponentScore}
                    setPlayerReady={setPlayerReady}
                    playerReady={playerReady}
                    opponentReady={opponentReady}
                    score={score}
                    numTargets={numTargets}
                    targetSize={targetSize}
                    setMissCount={setMissCount}
                    setScore={setScore}
                    setStreakCount={setStreakCount}
                />
                {showMenu && (
                    <Menu
                        currentRoom={currentRoom}
                        roomNo={roomNo}
                        setRoomNo={setRoomNo}
                        numTargets={numTargets}
                        setNumTargets={setNumTargets}
                        targetSize={targetSize}
                        setTargetSize={setTargetSize}
                    />
                )}
            </main>
        </div>
    );
}

export default App;
