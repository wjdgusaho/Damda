import React, { useState } from "react"
import tw from "tailwind-styled-components"
import { serverUrl } from "../../urls"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { useSelector } from "react-redux"
import { RootState } from "../../store/Store"
import { getCookieToken } from "../../store/Cookie"
import { GetNewTokens } from "./RefreshTokenApi"
import { ThemeProvider, styled } from "styled-components"
import { SubHeader } from "../inc/SubHeader"

const Box = tw.div`
  flex
  justify-center
  mt-10
  mx-auto
  flex-col
  text-center
  w-96
`

const InputText = styled.input`
  margin-top: 5px;
  display: flex;
  margin: auto;
  width: 320px;
  background-color: transparent;
  outline: none;
  border-bottom: 1px solid ${(props) => props.theme.colorCommon};
  color: ${(props) => props.theme.colorCommon};
`

const TextStyle = styled.p`
  color: ${(props) => props.theme.colorCommon};
`
const AmphText = styled.span`
  color: ${(props) => props.theme.colorEtc};
`

const Button = styled.button`
  border-radius: 30px;
  font-family: "pretendard";
  font-size: 20px;
  font-weight: 400;
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

const InfoImage = styled.div`
  position: relative;
  background-image: url(${(props) => props.theme.InfoImg_sm});
  background-repeat: no-repeat;
  background-size: cover;
  width: 200px;
  height: 200px;
  @keyframes floatingAnimation {
    0% {
      transform: translateY(0); /* 시작 위치 (위치 이동 없음) */
    }
    50% {
      transform: translateY(-10px); /* 위로 10px 이동 */
    }
    100% {
      transform: translateY(0); /* 다시 원래 위치로 이동 */
    }
  }
  animation: floatingAnimation 2s ease-in-out infinite;
`

export const CheckPassword = function () {
  const [userPw, setUserPw] = useState("")
  let Token = useSelector((state: RootState) => state.auth.accessToken)
  const navigate = useNavigate()
  const handlePwChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserPw(event.currentTarget.value)
  }
  const getNewToken = GetNewTokens()

  const handlePwSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    restart = true,
    token: string | null = Token
  ) => {
    event.preventDefault()

    if (userPw) {
      axios({
        method: "POST",
        url: serverUrl + "user/info",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        data: {
          userPw: userPw,
        },
      })
        .then((response) => {
          if (response.data.code === -9004) {
            alert("비밀번호가 일치하지 않습니다. 다시 입력해주세요.")
          } else {
            navigate("/user-info")
          }
          setUserPw("")
        })
        .catch(async (error) => {
          if (error.response.data.message === "토큰 만료" && restart) {
            try {
              const newaccessToken = await getNewToken(getCookieToken())
              handlePwSubmit(event, false, newaccessToken)
            } catch (error) {
              console.log(error)
            }
          } else {
            console.log(error)
          }
        })
    } else {
      alert("비밀번호를 입력하세요.")
    }
  }

  return (
    <div>
      <SubHeader></SubHeader>
      <Box>
        <InfoImage style={{ marginLeft: "auto", marginRight: "auto" }} />
        <div style={{ marginLeft: "auto", marginRight: "auto" }}>
          <TextStyle>
            회원님의 개인정보를 안전하게 보호하기 위해
            <br />
            <AmphText>2차 인증 후 변경이 가능</AmphText>
            합니다.
          </TextStyle>
        </div>
        <form className="mt-10 text-left h-20" onSubmit={handlePwSubmit}>
          <TextStyle className="ml-7">비밀번호</TextStyle>
          <InputText type="password" onChange={handlePwChange} />
          <Button className="fixed bottom-12 left-0 right-0 w-64 h-16 flex items-center justify-center m-auto">
            확인
          </Button>
        </form>
      </Box>
    </div>
  )
}
