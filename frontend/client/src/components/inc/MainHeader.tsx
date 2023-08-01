import React from "react"
import { useNavigate } from "react-router-dom"
import { styled } from "styled-components"

const TextStyle = styled.p`
  font-family: "pretendard";
  font-weight: 300;
  color: ${(props) => props.theme.colorCommon};
  opacity: 80%;
`
const ThemeBtn = styled.div`
  background-image: url(${(props) =>
    props.theme.colorCommon === "black"
      ? "assets/icons/themeBtnD.png"
      : "assets/icons/themeBtnL.png"});
  background-repeat: no-repeat;
  background-size: cover;
  width: 83px;
  height: 30px;
`
const AlermIcon = styled.div`
  background-image: url(${(props) =>
    props.theme.colorCommon === "black"
      ? "assets/icons/alermD.png"
      : "assets/icons/alermL.png"});
  background-repeat: no-repeat;
  background-size: cover;
  width: 25px;
  height: 25px;
`
const MenuIcon = styled.div`
  background-image: url(${(props) =>
    props.theme.colorCommon === "black"
      ? "assets/icons/hamburgerD.png"
      : "assets/icons/hamburgerL.png"});
  background-repeat: no-repeat;
  background-size: cover;
  width: 25px;
  height: 25px;
`
const RefreshIcon = styled.div`
  background-image: url(${(props) =>
    props.theme.colorCommon === "black"
      ? "assets/icons/refreshD.png"
      : "assets/icons/refreshL.png"});
  background-repeat: no-repeat;
  background-size: cover;
  width: 25px;
  height: 25px;
`

export const MainHeader = function () {
  const navigate = useNavigate()
  return (
    <div>
      <div className="w-10/12 m-auto mt-12 flex justify-between">
        <ThemeBtn
          className="flex justify-center items-center w-20 rounded-lg"
          onClick={() => {
            navigate("/selecttheme")
          }}
        />
        <div className="flex items-center">
          <AlermIcon
            className="mr-6"
            onClick={() => {
              navigate("/menu")
            }}
          />
          <MenuIcon
            onClick={() => {
              navigate("/menu")
            }}
            className="h-6"
          />
        </div>
      </div>
      <div className="flex items-center justify-end mr-8 mt-8">
        <TextStyle className="opacity-80 mr-2">
          날씨, 위치 업데이트 하기
        </TextStyle>
        <RefreshIcon className="h-7" />
      </div>
    </div>
  )
}
