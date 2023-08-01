import React from "react"
import "../index.css"
import tw from "tailwind-styled-components"
import { styled } from "styled-components"
import { SubHeader } from "./inc/SubHeader"
import {
  changeUniverseDarkTheme,
  changeUniverseLightTheme,
  changeHeartTheme,
  changeMarbleTheme,
} from "../store/Theme"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../store/Store"
import "./datePicker.css"

const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  font-family: "Pretendard";
  justify-content: center;
  img {
    filter: drop-shadow(0px 4px 4px rgb(0, 0, 0, 0.4));
  }
`

const SelectTheme = function () {
  let dispatch = useDispatch()
  let Theme = useSelector((state: RootState) => state.theme.color50)

  return (
    <>
      <SubHeader />
      <Box className="w-80 m-auto mt-10">
        <img
          onClick={() => {
            dispatch(changeUniverseDarkTheme())
          }}
          className={Theme === "#fbf8fc" ? "my-5 selectedTheme" : "my-5"}
          src="../../UniverseDark.png"
          alt="UniverseDark"
        />
        <img
          onClick={() => {
            dispatch(changeUniverseLightTheme())
          }}
          className={Theme === "#f3f5fb" ? "my-5 selectedTheme" : "my-5"}
          src="../../UniverseLight.png"
          alt="UniverseLight"
        />
        <img
          onClick={() => {
            dispatch(changeHeartTheme())
          }}
          className={Theme === "#F6F6F6" ? "my-5 selectedTheme" : "my-5"}
          src="../../Heart.png"
          alt="Heart"
        />
        <img
          onClick={() => {
            dispatch(changeMarbleTheme())
          }}
          className={Theme === "#F4F6F9" ? "my-5 selectedTheme" : "my-5"}
          src="../../Marble.png"
          alt="Marble"
        />
      </Box>
    </>
  )
}

export default SelectTheme
