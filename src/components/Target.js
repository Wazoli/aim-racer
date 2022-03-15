import React from 'react'

export default function Target(props){
    return(
        <div onClick={props.handleClick} style = {props.style} className = {'circle'}></div>
    )
}