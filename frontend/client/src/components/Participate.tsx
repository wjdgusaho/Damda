import React, { useState } from "react"
import "../index.css"
import { styled } from "styled-components"
import { useNavigate } from "react-router"
import { SubHeader } from "./inc/SubHeader"
import axios from "axios"
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

const Participate = function ({ code = "" }: { code: string }) {
  const token = useSelector((state: RootState) => state.auth.accessToken)
  const [inviteCode, setInviteCode] = useState(code)
  const navigate = useNavigate()

  function inputCode(e: React.FormEvent<HTMLInputElement>) {
    setInviteCode(e.currentTarget.value)
  }

  function FormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    axios({
      method: "POST",
      url: process.env.REACT_APP_SERVER_URL + "timecapsule/join",
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
          alert("타임캠슐이 존재하지 않습니다.")
        } else if (res.data.code === -3000) {
          alert("참가 불가능한 타임캡슐입니다.")
        } else if (res.data.code === -3004) {
          alert("이미 참여 중인 타임캡슐입니다.")
        } else if (res.data.code === -3005) {
          alert("해당 타임캡슐의 참여인원이 가득 찼습니다.")
        } else if (res.data.code === 500) {
          alert("에러가 발생했습니다. 잠시 후 다시 시도해주세요.")
        } else if (res.data.code === -3011) {
          alert(
            "보유 가능한 타임캡슐의 개수를 초과했습니다. 상점에서 추가 가능합니다."
          )
        }
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
