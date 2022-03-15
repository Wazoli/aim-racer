import React, {useState} from 'react'

export default function Header(props){
    return(
        <header className='header'>
            <ul className = 'header-items'>
                <li className='header-score header-item'>Score : {props.score}</li>
                <li className='header-misses header-item'>Misses : {props.missCount}</li>
                <li className='header-streak header-item'>Streak : {props.streakCount}</li>
                <li onClick={() => props.setShowMenu(prev=>!prev)} className='header-menu header-item'>Menu</li>
            </ul>
        </header>
    )
}