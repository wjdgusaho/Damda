import React, { useState } from "react"
import tw from "tailwind-styled-components"
import { serverUrl } from "../../urls"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useSelector } from "react-redux"
import { RootState } from "../../store/Store"
import { getCookieToken } from "../../store/Cookie"
import { GetNewTokens } from "./RefreshTokenApi"
import { styled } from "styled-components"
import { SubHeader } from "../inc/SubHeader"

const Box = styled.div`
  display: flex;
  flex-direction: column;
  font-family: "Pretendard";
  color: ${(props) => props.theme.colorCommon};
  align-items: center;
`

const InputText = styled.input`
  background-color: rgb(255, 255, 255, 0);
  border-bottom: 2px solid ${(props) => props.theme.colorCommon};
  height: 50px;
  outline: none;
  font-weight: 200;
`

const AmphText = styled.span`
  color: ${(props) => props.theme.colorEtc};
`

const Button = styled.button`
  border-radius: 30px;
  font-family: "pretendard";
  font-size: 24px;
  font-weight: 400;
  box-shadow: 0px 4px 4px ${(props) => props.theme.colorShadow};
  color: ${(props) => props.theme.color900};
  background-color: ${(props) => props.theme.color100};
  &:hover {
    transition: 0.2s;
    transform: scale(0.95);
    color: ${(props) => props.theme.color100};
    background-color: ${(props) => props.theme.color600};
  }
`

const InfoImage = styled.div`
  position: relative;
  background-image: url(${(props) => props.theme.InfoImg_sm});
  background-repeat: no-repeat;
  background-size: cover;
  width: 145px;
  height: 145px;
  margin-top: 40px;
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

const ContentWrap = tw.div`
    flex
    justify-start
    w-full
`

const Content = styled.div`
  margin-top: 2.25rem;
  font-size: 1.25rem;
  font-weight: 300;
  span {
    opacity: 0.47;
    font-size: 14px;
    color: ${(props) => props.theme.colorCommon};
    margin-left: 15px;
  }
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
    <>
      <SubHeader />
      <Box className="w-80 m-auto">
        <InfoImage />
        <div className="font-light">
          회원님의 개인정보를 안전하게 보호하기 위해
        </div>
        <div className="font-light">
          <AmphText className="font-normal">2차 인증 후 변경이 가능</AmphText>
          합니다.
        </div>
        <form onSubmit={handlePwSubmit}>
          <ContentWrap className="mt-3">
            <Content>비밀번호</Content>
          </ContentWrap>
          <InputText
            className="w-80"
            type="password"
            onChange={handlePwChange}
          />
          <Button className="fixed bottom-12 left-0 right-0 w-64 h-16 flex items-center justify-center m-auto">
            확인
          </Button>
        </form>
      </Box>
    </>
  )
}
