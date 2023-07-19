import React from "react";
import { styled } from "styled-components";

const Box = styled.div`
    display: flex;
    justify-content: center;
    width: 300px;   
    flex-wrap: wrap;
    margin-left: auto;
    margin-right: auto;
    margin-top: 150px;
`

const Person = styled.img`
    position: absolute;
    top: 350px;
    left: 180px;
`

export const LandingPage = function () {

    return (
        <Box>
            <img src="logo.png" alt="logo" />
            <p style={{fontFamily: 'PyeongChangPeace', opacity: '50%'}}>우리의 추억을 타임캡슐에 담아요어쩌구</p>
            <img src="assets/UFO.png" alt="UFO" width="250px" height="250px"/>
            <Person src="assets/Astronaut-1.png" alt="Astronaut" width="150px" height="150px"/>
        </Box>
    )
}