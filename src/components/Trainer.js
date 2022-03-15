import React, {useEffect, useState} from "react";

import Target from "./Target";

export default function Trainer(props) {
    
    // 
    // const [lastDeleted, setLastDeleted] = useState();

    // function getRandomCoords(){
    //     let randomRow = Math.floor(Math.random() * 7) + 1
    //     let randomCol = Math.floor(Math.random() * 13) + 1
    //     if(lastDeleted){
    //         while(randomRow == lastDeleted[0] && randomCol == lastDeleted[1]){
    //             randomRow = Math.floor(Math.random() * 7) + 1
    //             randomCol = Math.floor(Math.random() * 13) + 1
    //         }
    //     }
    //     return [randomRow, randomCol]
    // }

    // function checkCoords(row, col, tars){
    //     for(let i = 0; i < tars.length ; i += 1){
    //         if (tars[i][0] === row && tars[i][1] === col){
    //             return false;
    //         }
    //     }
    //     return true;
    // }

    // function deleteCoord(row, col){
    //     for(let i = 0; i < targets.length; i++){
    //         const targetRow = targets[i][0]
    //         const targetCol = targets[i][1]
    //         if(row == targetRow && col == targetCol){
    //             setTargets(prevState => {
    //                 return prevState.filter((p, index) => (index != i))
    //             })
    //             setLastDeleted([targetRow, targetCol])
    //             return;
    //         }
    //     }
    // }

    // function addCoord(){
    //     let randomRow
    //     let randomCol
    //     [randomRow, randomCol] = getRandomCoords();
    //     while(!checkCoords(randomRow, randomCol, targets)){
    //         [randomRow, randomCol] = getRandomCoords();
    //     }
    //     setTargets(prev => [...prev, [randomRow, randomCol]])
    // }

    // function targetMissed(){

    // }

    // function targetClicked(e){
    //     props.setStreakCount(prev => prev + 1)
    //     props.setScore(prev => prev + 100)
    //     let row = e.target.style.gridRow
    //     let col = e.target.style.gridColumn
    //     row = parseInt(row)
    //     col = parseInt(col)
    //     console.log(row, col)
    //     deleteCoord(row, col);
    //     e.stopPropagation()
    // }

    // useEffect(()=>{
    //     if(targets.length < props.numTargets){
    //         addCoord();
    //     }
    //     if(targets.length > props.numTargets){
    //         deleteCoord(targets[0][0], targets[0][1])
    //     }
    //     let style = {
    //         width: props.targetSize + "px",
    //         height: props.targetSize + "px",
    //     }
    //     const elements = targets.map((coord, i) => {
    //         return (<Target style = {{...style, gridRow : coord[0], gridColumn: coord[1]}} handleClick = {targetClicked} key = {i}/>)
    //     })
    //     setTargetEls(elements)
    // }, [targets, props.numTargets])

    // // useEffect(()=>{
    // //     getTargets()
    // // }, [])

    // useEffect(()=>{
    //     if(targets.length < props.numTargets){
    //         addCoord();
    //     }
    //     if(targets.length > props.numTargets){
    //         deleteCoord(targets[0][0], targets[0][1])
    //     }
    //     let style = {
    //         width: props.targetSize + "px",
    //         height: props.targetSize + "px",
    //     }
    //     const elements = targets.map((coord, i) => {
    //         return (<Target style = {{...style, gridRow : coord[0], gridColumn: coord[1]}} handleClick = {targetClicked} key = {i}/>)
    //     })
    //     setTargetEls(elements)
    // }, [targets, props.numTargets])

    // useEffect(()=>{
    //     let style = {
    //         width : props.targetSize + 'px',
    //         height : props.targetSize + 'px'
    //     }
    //     const elements = targets.map((coord, i) => {
    //         return (<Target style = {{...style, gridRow : coord[0], gridColumn: coord[1]}} handleClick = {targetClicked} key = {i}/>)
    //     })
    //     console.log(elements)
    //     setTargetEls(elements)
    // }, [props.targetSize])

    // useEffect(()=>{
    //     console.log(targetEls)
    // }, [targetEls])

    const [targetEls, setTargetEls] = useState([]);
    const [targets, setTargets] = useState([]);
    const [lastTarget, setLastTarget] = useState(-1);
    const [visibilities, setVisibilities] = useState([]);

    function targetClicked(e){
        let id = parseInt(e.target.classList[0])
        setVisibilities(prev => {
            let result = prev.map(x => x)
            result[id] = 'hidden'
            return result
        })
        setLastTarget(id)
        props.setScore(prev => prev + 100)
        props.setStreakCount(prev => prev + 1)
        e.stopPropagation()
    }

    function targetMissed(){
        props.setMissCount(prevState => prevState + 1)
        props.setScore(prev => prev - 50)
        props.setStreakCount(0)
    }

    function prepareGrid(){
        let targEls = []
        for(let i = 0; i < 7 * 13; i++){
            targEls.push((<Target visibility = {visibilities[i]} targetSize = {props.targetSize} handleClick = {targetClicked} id = {i} key = {i}/>))
        }
        setTargetEls(targEls)
    }

    function addTarget(){
        let randomTarget = Math.floor(Math.random() * 7 * 13)
        while(targets.includes(randomTarget) || randomTarget === lastTarget){
            randomTarget = Math.floor(Math.random() * 7 * 13)
        }
        setTargets(prev => [...prev, randomTarget])
        setVisibilities(prev => {
            let result = prev.map(el => el)
            result[randomTarget] = 'visible'
            return result
        })
    }

    function removeTarget(){
        let removeId = targets[0]
        setTargets(prev => prev.filter((x, i) => i !== 0))
        setVisibilities(prev => {
            let result = prev.map(el => el)
            result[removeId] = 'hidden'
            return result
        })
    }

    useEffect(()=>{
        let result = []
        for(let i = 0; i < 7 * 13; i++){
            result.push('hidden')
        }
        setVisibilities(result)
    }, [])

    useEffect(()=>{
        if(visibilities){
            prepareGrid();
        }
    }, [visibilities, props.targetSize])

    useEffect(()=>{
        if(targetEls){
            if(targets.length < props.numTargets){
                addTarget()
            }
            if(targets.length > props.numTargets){
                removeTarget()
            }
        }
    }, [targets, targetEls, props.numTargets, lastTarget])

    useEffect(()=>{
        setTargets(prev => prev.filter((x) => x !== lastTarget))
    }, [lastTarget])


    
    return (
        <div onClick = {targetMissed} className="trainer-container">
            <div className="trainer">
                {targetEls}
            </div>
        </div>
    );
}
