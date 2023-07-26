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

const InputCode = styled.input`
  background-color: rgb(255, 255, 255, 0);
  border-bottom: 2px solid rgb(255, 255, 255, 0.83);
  height: 50px;
  text-align: center;
  margin-top: 40px;
  z-index: 1;
  outline: none;
`

const Btn = styled.button`
  background-color: #f6eef9;
  color: #441f4c;
  width: 270px;
  height: 66px;
  border-radius: 30px;
  font-size: 24px;
  font-weight: 500;
  box-shadow: 0px 4px 4px #534177;
  font-family: "Pretendard";
  position: absolute;
  bottom: 10%;
  z-index: 2;
`
const HeaderWrap = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`

const Participate = function () {
  return (
    <Background>
      <HeaderWrap>
        <SubHeader />
      </HeaderWrap>
      <Box>
        <>
          <div>초대 코드를 입력하세요</div>
          <InputCode type="text" name="code" id="code" />
        </>
        <Btn>참여하기</Btn>
      </Box>
    </Background>
  )
}

export default Participate
