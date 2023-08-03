import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { styled } from "styled-components"

const Box = styled.div`
  display: flex;
  justify-content: center;
  width: 300px;
  flex-wrap: wrap;
  margin-left: auto;
  margin-right: auto;
  margin-top: 30vh;
  animation: 3s ease-in-out 0s 1 alternate show-image;

  @keyframes show-image {
    from {
      opacity: 0;
      transform: translateY(-50px);
    }
    to {
      opacity: 1;
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
  const navigate = useNavigate()

  useEffect(() => {
    let a = setTimeout(() => {
      navigate("/login")
    }, 4000)
    return () => {
      clearTimeout(a)
    }
  })

  return (
    <Box>
      <img
        src="assets/universe/UFO.png"
        alt="UFO"
        width="250px"
        height="250px"
      />
      <Person
        src="assets/universe/Astronaut-1.png"
        alt="Astronaut"
        width="130px"
        height="130px"
      />
      <Shadow />
    </Box>
  )
}
