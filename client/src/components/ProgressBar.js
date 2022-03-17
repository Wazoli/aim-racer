import React, {useState, useEffect} from "react";

export default function ProgressBar(props){
    const [width, setWidth] = useState(0)
    useEffect(()=>{
        if(props.score > 0){
            setWidth((props.score / 10000) * 100)
        }
    }, [props.score])
    return(
        <div className={`progress-outer player-${props.player}`}>
            <div style = {{width : width + '%'}} className={`progress-inner player-${props.player}`}></div>
        </div>
    )
}