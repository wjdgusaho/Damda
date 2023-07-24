import React from 'react'
import { styled } from 'styled-components'

const Person = styled.img`
    position: relative;
    top: -180px;
    left: 80px;
`

const Shadow = styled.div`
    z-index: -1;
    background-color: black;
    position: relative;
    width: 220px;
    height: 60px;
    opacity: 0.15;
    border-radius: 50%;
    box-shadow: 0px 0px 10px 20px black;
    top: -230px;
    left: 0px;
`

export const MainHeader = function () {
    return (
        <div>
            <img src="logo.png" alt="logo"/>
            <p className='text-victoria-500'>우리의 추억을 타임캡슐에 담아요어쩌구~!</p>
            <img src="assets/UFO.png" alt="UFO" width="250px" height="250px" />
            <Person src="assets/Astronaut-1.png" alt="Astronaut" width="130px" height="130px" />
            <Shadow />
        </div>
    )
}
