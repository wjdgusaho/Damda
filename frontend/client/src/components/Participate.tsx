import React, { useState } from "react"
import "../index.css"
import tw from "tailwind-styled-components"
import { styled } from "styled-components"
import { useNavigate } from "react-router"
import { SubHeader } from "./inc/SubHeader"
import axios from "axios"
import { serverUrl } from "../urls"
import { useSelector } from "react-redux"
import { RootState } from "../store/Store"

const Background = styled.div`
  background-image: url(${(props) => props.theme.bgImg});
  background-size: 540px;
  background-position-x: center;
  background-position-y: 60px;
  background-repeat: no-repeat;
  width: 100%;
  height: 100vh;
  position: relative;
`

const Box = styled.form`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.theme.colorCommon};
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
  border-color: ${(props) => props.theme.colorCommon};
`

const Btn = styled.button`
  width: 256px;
  height: 64px;
  border-radius: 30px;
  font-size: 24px;
  font-weight: 500;
  font-family: "Pretendard";
  position: absolute;
  bottom: 10%;

  box-shadow: 0px 4px 4px ${(props) => props.theme.colorShadow};
  color: ${(props) => props.theme.color100};
  background-color: ${(props) => props.theme.color900};
  &:hover {
    transition: 0.2s;
    transform: scale(0.95);
    color: ${(props) => props.theme.color100};
    background-color: ${(props) => props.theme.color700};
  }
`
const HeaderWrap = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`

const Participate = function () {
  const token = useSelector((state: RootState) => state.auth.accessToken)
  const [inviteCode, setInviteCode] = useState("")
  const navigate = useNavigate()

  function inputCode(e: React.FormEvent<HTMLInputElement>) {
    setInviteCode(e.currentTarget.value)
  }

  function FormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    axios({
      method: "POST",
      url: serverUrl + "timecapsule/join",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      data: {
        inviteCode: inviteCode,
      },
    })
      .then((res) => {
        if (res.data.code === 200) {
          console.log(res.data.data.timecapsule.timecapsuleNo)
          navigate(
            `/timecapsule/detail/${res.data.data.timecapsule.timecapsuleNo}`
          )
        } else if (res.data.code === -6002) {
          alert("타임캠슐이 존재하지 않습니다")
        } // 더 추가할거임
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <Background>
      <HeaderWrap>
        <SubHeader />
      </HeaderWrap>
      <Box onSubmit={FormSubmit}>
        <div>초대 코드를 입력하세요</div>
        <InputCode onChange={inputCode} type="text" name="code" id="code" />
        <Btn type="submit">참여하기</Btn>
      </Box>
    </Background>
  )
}

export default Participate
