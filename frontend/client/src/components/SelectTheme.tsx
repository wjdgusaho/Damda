import React, { useState } from "react"
import "../index.css"
import tw from "tailwind-styled-components"
import { styled } from "styled-components"
import { useNavigate } from "react-router"
import { SubHeader } from "./inc/SubHeader"
import {
  changeUniverseDarkTheme,
  changeUniverseLightTheme,
  changeHeartTheme,
  changeMarbleTheme,
} from "../store/Theme"
import { useDispatch, useSelector } from "react-redux"

const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  font-family: "Pretendard";
  justify-content: center;
`

const ImgBtn = styled.img`
  filter: drop-shadow(0px 4px 4px rgb(0, 0, 0, 0.4));
`

const SelectTheme = function () {
  let dispatch = useDispatch()
  let state = useSelector((state) => {
    return state
  })

  console.log(state)
  return (
    <>
      <SubHeader />
      <Box className="w-80 m-auto mt-10">
        <ImgBtn
          onClick={() => {
            dispatch(changeUniverseDarkTheme())
          }}
          className="my-5"
          src="../../UniverseDark.png"
          alt="UniverseDark"
        />
        <ImgBtn
          onClick={() => {
            dispatch(changeUniverseLightTheme())
          }}
          className="my-5"
          src="../../UniverseLight.png"
          alt="UniverseLight"
        />
        <ImgBtn
          onClick={() => {
            dispatch(changeHeartTheme())
          }}
          className="my-5"
          src="../../Heart.png"
          alt="Heart"
        />
        <ImgBtn
          onClick={() => {
            dispatch(changeMarbleTheme())
          }}
          className="my-5"
          src="../../Marble.png"
          alt="Marble"
        />
      </Box>
    </>
  )
}

export default SelectTheme
