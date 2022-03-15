import React, { useEffect, useState } from "react";
import Target from "./Target";

const { io } = require("socket.io-client");

export default function Trainer(props) {
    const [socket, setSocket] = useState(io());
    const [targetEls, setTargetEls] = useState([]);
    const [targets, setTargets] = useState([]);
    const [lastTarget, setLastTarget] = useState(-1);
    const [visibilities, setVisibilities] = useState([]);

    function targetClicked(e) {
        let id = parseInt(e.target.classList[0]);
        setVisibilities((prev) => {
            let result = prev.map((x) => x);
            result[id] = "hidden";
            return result;
        });
        setLastTarget(id);
        props.setScore((prev) => prev + 100);
        props.setStreakCount((prev) => prev + 1);
        e.stopPropagation();
    }

    function targetMissed() {
        props.setMissCount((prevState) => prevState + 1);
        props.setScore((prev) => prev - 50);
        props.setStreakCount(0);
    }

    function prepareGrid() {
        let targEls = [];
        for (let i = 0; i < 7 * 13; i++) {
            targEls.push(
                <Target
                    visibility={visibilities[i]}
                    targetSize={props.targetSize}
                    handleClick={targetClicked}
                    id={i}
                    key={i}
                />
            );
        }
        setTargetEls(targEls);
    }

    function addTarget() {
        let randomTarget = Math.floor(Math.random() * 7 * 13);
        while (targets.includes(randomTarget) || randomTarget === lastTarget) {
            randomTarget = Math.floor(Math.random() * 7 * 13);
        }
        setTargets((prev) => [...prev, randomTarget]);
        setVisibilities((prev) => {
            let result = prev.map((el) => el);
            result[randomTarget] = "visible";
            return result;
        });
    }

    function removeTarget() {
        let removeId = targets[0];
        setTargets((prev) => prev.filter((x, i) => i !== 0));
        setVisibilities((prev) => {
            let result = prev.map((el) => el);
            result[removeId] = "hidden";
            return result;
        });
    }

    useEffect(() => {
        let result = [];
        for (let i = 0; i < 7 * 13; i++) {
            result.push("hidden");
        }
        setVisibilities(result);
    }, []);

    useEffect(() => {
        if (visibilities) {
            prepareGrid();
        }
    }, [visibilities, props.targetSize]);

    useEffect(() => {
        if (targetEls) {
            if (targets.length < props.numTargets) {
                addTarget();
            }
            if (targets.length > props.numTargets) {
                removeTarget();
            }
        }
    }, [targets, targetEls, props.numTargets, lastTarget]);

    useEffect(() => {
        setTargets((prev) => prev.filter((x) => x !== lastTarget));
    }, [lastTarget]);

    useEffect(() => {
        socket.on("connect", () => {
            console.log('oho');
        });
    }, []);

    return (
        <div onClick={targetMissed} className="trainer-container">
            <div className="trainer">{targetEls}</div>
        </div>
    );
}
