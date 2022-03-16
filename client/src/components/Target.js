import React from 'react'

export default function Target(props){
    return(
        <div onClick={props.handleClick} 
        style = {{width : props.targetSize, height : props.targetSize, visibility: props.visibility, gridArea: `${props.gridRow} / ${props.gridColumn} / span 1 / span 1`}} 
        className = {props.id + ' circle'}></div>
    )
}