import React, {useState} from "react";

export default function Menu(props){
    const [localRoomNo, setLocalRoomNo] = useState()

    function increaseTargetSize(){
        if(props.targetSize < 90){
            props.setTargetSize(prev => prev + 10)
        }
    }
    function decreaseTargetSize(){
        if(props.targetSize > 10){
            props.setTargetSize(prev => prev - 10)
        }
    }
    function increaseNumTargets(){
        if(props.numTargets < 50){
            props.setNumTargets(prev => prev + 1)
        }
    }
    function decreaseNumTargets(){
        if(props.numTargets > 1){
            props.setNumTargets(prev => prev - 1)
        }
    }
    return(
        <div className="menu">
            <h1>Menu</h1>
            <h2>Target Size</h2>
            <div className="cols">
                <div onClick={decreaseTargetSize} className="btn-primary btn">-</div>
                <div style = {{width : props.targetSize + "px", height : props.targetSize + "px"}} className="circle dark"></div>
                <div onClick={increaseTargetSize} className="btn-secondary btn">+</div>
            </div>
            <h2 className="num-targets-title">Number of Targets</h2>
            <div className="cols">
                <div onClick={decreaseNumTargets} className="btn-primary btn">-</div>
                <h1 className="num-targets">{props.numTargets}</h1>
                <div onClick={increaseNumTargets} className="btn-secondary btn">+</div>
            </div>
            <div className="roomEntry">
                <h2>Room Number</h2>
                <h3>{`Current Room : ${props.currentRoom}`}</h3>
                <input value = {localRoomNo} onChange={(e)=>setLocalRoomNo(e.target.value)} className="room-input" type = 'text'></input>
                <div onClick={() => props.setRoomNo(parseInt(localRoomNo))} className="btn-secondary submit btn">Submit</div>
            </div>
        </div>
    )
}