import React from 'react'
import { styled } from 'styled-components'

const Box = styled.div`
    display: flex;
    justify-content: center;
    width: 300px;
    flex-wrap: wrap;
    margin-left: auto;
    margin-right: auto;
    margin-top: 150px;
    animation: 3s ease-in-out 0s 1 alternate show-image;

    @keyframes show-image {
        from {
            opacity: 0;
            transform: translateY(-50px);
            transform: rotate3d(0, 10, 0, 45deg);
        }
        to {
            opacity: 1;
            transform: rotate3d(0, 0, 0, 45deg);
        }
    }
`

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

export const LandingPage = function () {
    return (
        <Box>
            <img src="logo.png" alt="logo" />
            <p style={{ fontFamily: 'PyeongChangPeace', opacity: '50%' }}>우리의 추억을 타임캡슐에 담아요어쩌구</p>
            <img src="assets/UFO.png" alt="UFO" width="250px" height="250px" />
            <Person src="assets/Astronaut-1.png" alt="Astronaut" width="130px" height="130px" />
            <Shadow />
        </Box>
    )
}
