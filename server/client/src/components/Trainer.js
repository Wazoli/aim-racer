import React, { useEffect, useState } from "react";
import Target from "./Target";
import Flash from "./Flash";

const totalGridNum = 7 * 13;
const numRows = 7;
const numCols = 13;
const flashPopDelay = 570 //ms
const flashDuration = 2000 //ms
const flashCircleDuration = 750 //ms

export default function Trainer(props) {

    const [targetEls, setTargetEls] = useState([]);
    const [targets, setTargets] = useState([]);
    const [lastTarget, setLastTarget] = useState(-1);
    const [visibilities, setVisibilities] = useState([]);
    const [flashEl, setFlashEl] = useState();
    const [mouseOnGrid, setMouseOnGrid] = useState(true)

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
        for (let i = 0; i < totalGridNum; i++) {
            let row = 1 + Math.floor(i / numCols);
            let col = 1 + ((i) % numCols);
            targEls.push(
                <Target
                    gridRow = {row}
                    gridColumn = {col}
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

    function getRandomFreeSpot() {
        let randomTarget = Math.floor(Math.random() * totalGridNum);
        while (targets.includes(randomTarget) || randomTarget === lastTarget) {
            randomTarget = Math.floor(Math.random() * totalGridNum);
        }
        return randomTarget;
    }

    function addTarget() {
        let randomTarget = getRandomFreeSpot();
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

    function watchYourEyes() {
        let randomFlash = getRandomFreeSpot();
        let row = 1 + Math.floor(randomFlash / numCols);
        let col = 1 + ((randomFlash) % numCols);
        let style = {
            // height: props.targetSize + "px",
            // width: props.targetSize + "px",
            gridRow: row,
            gridColumn: col,
        };
        setFlashEl(<Flash style={style} />);
    }

    useEffect(() => {
        let result = [];
        for (let i = 0; i < totalGridNum; i++) {
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
        let random = Math.random();
        if(targets.length === props.numTargets - 1){
            if (random < 1 && !flashEl) {
                watchYourEyes();
            }
        }
    }, [targets, props.numTargets, flashEl]);
    
    useEffect(()=>{
        if(flashEl){
            setTimeout(()=>{
                //if mouse on grid when flash pops
                if(document.getElementById('trainer-container').classList[0] === 'true'){
                    setFlashEl(undefined)
                    document.getElementById('flash-filter').classList.toggle('flash-filter')
                    setTimeout(()=>{
                        //flash plays through
                        if(document.getElementById('flash-filter').classList[0] == 'flash-filter'){
                            document.getElementById('flash-filter').classList.toggle('flash-filter')
                        }
                    }, flashDuration)
                }
            }, flashPopDelay)
            setTimeout(()=>{
                setFlashEl(undefined)
            }, flashCircleDuration)
        }
    }, [flashEl])

    return (
        <div onMouseEnter = {(()=>setMouseOnGrid(true))} onMouseLeave = {(()=>setMouseOnGrid(false))} onClick={targetMissed} id = 'trainer-container' className={`${mouseOnGrid} trainer-container`}>
            <div  id = 'trainer-grid' className="trainer">
                {targetEls}
                {flashEl}
            </div>
            <div id = 'flash-filter'></div>
        </div>
    );
}
