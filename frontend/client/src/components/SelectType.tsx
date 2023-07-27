import React from "react"
import "../index.css"
import tw from "tailwind-styled-components"
import { styled } from "styled-components"
import { useNavigate } from "react-router"
import { SubHeader } from "./inc/SubHeader"

const Background = styled.div`
  background-image: url("../../Background.png");
  background-size: 540px;
  background-position-x: center;
  background-position-y: 60px;
  background-repeat: no-repeat;
  width: 100%;
  height: 100vh;
  position: relative;
`

const TypeBtn = styled.button`
  background-color: rgba(255, 255, 255, 0.3);
  width: 297px;
  height: 70px;
  font-size: 20px;
  border-radius: 15px;
  color: #fff;
  font-weight: 100;
  margin-bottom: 55px;
  box-shadow: 0px 4px 4px rgb(33, 25, 74, 0.4);
`

const HeaderWrap = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`

const Box = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #e4e6f5;
  font-family: "Pretendard";
  font-size: 20px;
`

const HelpIcon = styled.img`
  width: 36px;
  height: 36px;
`

const SelectType = function () {
  return (
    <Background>
      <HeaderWrap>
        <SubHeader />
      </HeaderWrap>
      <Box>
        <div className="flex">
          <div className="mb-5 ml-9">어떤 타임캡슐을 만들어 볼까요?</div>
          <HelpIcon
            className="mt-12 mb-8"
            src="../../assets/icons/questionMark.png"
            alt="questionMark"
          />
        </div>
        <TypeBtn>클래식 타임캡슐</TypeBtn>
        <TypeBtn>기록 타임캡슐</TypeBtn>
        <TypeBtn>목표 타임캡슐</TypeBtn>
      </Box>
    </Background>
  )
}

export default SelectType
