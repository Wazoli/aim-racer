import React from 'react'

export default function Target(props){
    return(
        <div onClick={props.handleClick} style = {{width : props.targetSize, height : props.targetSize, visibility: props.visibility}} className = {props.id + ' circle'}></div>
    )
}