import axios from "axios"
import React, { useState, useEffect, useRef } from "react"
import tw from "tailwind-styled-components"
import { useNavigate } from "react-router"
import { Link } from "react-router-dom"
import toast, { Toaster } from "react-hot-toast"
import { motion } from "framer-motion"
import { styled } from "styled-components"
import { SubHeader } from "../inc/SubHeader"

// 비밀번호 정규식
const passwordRegex = /^(?=.*[a-zA-Z])[!@#$%^*+=-]?(?=.*[0-9]).{5,25}$/

const Box = styled.div`
  display: flex;
  flex-direction: column;
  font-family: "Pretendard";
  color: ${(props) => props.theme.colorCommon};
  align-items: center;
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

const AmphText = styled.span`
  color: ${(props) => props.theme.colorEtc};
`

const InputText = styled.input`
  background-color: rgb(255, 255, 255, 0);
  border-bottom: 2px solid ${(props) => props.theme.colorCommon};
  height: 50px;
  outline: none;
  font-weight: 200;
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

const BackIcon = styled.div`
  background-image: url(${(props) =>
    props.theme.colorCommon === "black"
      ? "..//assets/icons/arrow_lD.png"
      : "..//assets/icons/arrow_l.png"});
  background-repeat: no-repeat;
  background-size: contain;
  width: 15px;
  height: 25px;
`

const Form = tw.form`
  grid
  grid-cols-1
  mt-10
  mx-auto
`

export const FindPassword = function () {
  const [userEmail, setUserEmail] = useState("")
  const [userCode, setUserCode] = useState("")
  const [getCode, setGetCode] = useState(false)
  const [change, setChange] = useState(false)
  const [password, setPassword] = useState("")
  const [checkPassword, setCheckPassword] = useState("")
  const [userPwMatch, setuserPwMatch] = useState(0)
  const [userPwCondition, setUserPwCondition] = useState(0)
  const [sendCode, setSendCode] = useState(false)
  const navigate = useNavigate()
  const intervalRef = useRef<NodeJS.Timeout>()

  const goBack = () => {
    navigate(-1) // 뒤로가기
  }

  useEffect(() => {
    if (!checkPassword && passwordRegex.test(checkPassword)) {
      setuserPwMatch(0)
    } else if (password && checkPassword) {
      if (password !== checkPassword) {
        setuserPwMatch(1)
      } else {
        setuserPwMatch(2)
      }
    }
  }, [password, checkPassword])

  useEffect(() => {
    if (password) {
      if (passwordRegex.test(password)) {
        setUserPwCondition(1)
      } else {
        setUserPwCondition(2)
      }
    } else {
      setUserPwCondition(0)
    }
  }, [password])

  useEffect(() => {
    return () => clearInterval(intervalRef.current)
  }, [])

  function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
    setUserEmail(event.currentTarget.value)
  }
  function handleCodeChange(event: React.ChangeEvent<HTMLInputElement>) {
    setUserCode(event.currentTarget.value)
  }
  function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
    setPassword(event.currentTarget.value)
  }
  function handleCheckPasswordChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setCheckPassword(event.currentTarget.value)
  }

  function handleSubmitEmail(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSendCode(true)
    axios({
      method: "POST",
      url: process.env.REACT_APP_SERVER_URL + "user/change-password/email",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        email: userEmail,
      },
    })
      .then(async (response) => {
        if (response.data.code === 200) {
          setGetCode(true)
          seconds = 600
          startCountdown()
        } else {
          toast(response.data.message)
        }
      })
      .catch((error) => {
        console.error(error)
      })
      .finally(() => {
        setSendCode(false)
      })
  }
  let seconds = 0

  function startCountdown() {
    intervalRef.current = setInterval(() => {
      const countdownElement = document.querySelector(
        "#countdown"
      ) as HTMLSpanElement
      const minuteRemaining = Math.floor(seconds / 60)
      const secondRemaining = seconds % 60

      countdownElement.textContent = `${String(minuteRemaining).padStart(
        2,
        "0"
      )}:${String(secondRemaining).padStart(2, "0")}`

      if (seconds === 0) {
        clearInterval(intervalRef.current)
        countdownElement.textContent = "인증번호 만료"
        countdownElement.style.color = "red"
      }

      seconds--
    }, 1000)
  }

  function handleSubmitCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    axios({
      method: "POST",
      url: process.env.REACT_APP_SERVER_URL + "user/change-password/code",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        email: userEmail,
        code: userCode,
      },
    })
      .then((response) => {
        if (response.data.code === 200) {
          clearInterval(intervalRef.current)
          setChange(true)
        } else {
          toast(response.data.message)
        }
        setUserCode("")
      })
      .catch((error) => {
        console.error(error)
      })
  }

  function handleSubmitPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (password !== checkPassword) {
      toast("비밀번호가 일치하지 않습니다.")
      setCheckPassword("")
    } else {
      axios({
        method: "PATCH",
        url: process.env.REACT_APP_SERVER_URL + "user/change-password/new",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          email: userEmail,
          userPw: password,
        },
      })
        .then((response) => {
          toast(response.data.message)
          if (response.data.code === 200) {
            navigate("/login")
          }
        })
        .catch((error) => console.error(error))
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="w-10/12 m-auto mt-12 flex justify-between">
        <BackIcon onClick={goBack} />
      </div>
      <Box className="w-80 m-auto">
        <Toaster toastOptions={{ duration: 1000 }} />
        <InfoImage />
        {!change && (
          <>
            <div className="font-light text-center">
              <AmphText className="font-normal">가입시 등록한 이메일</AmphText>
              로
            </div>
            <div className="font-light text-center">
              비밀번호를 재설정합니다.
            </div>
            <form onSubmit={handleSubmitEmail}>
              <ContentWrap className="mt-3">
                <Content>이메일</Content>
              </ContentWrap>
              <InputText
                className="w-80"
                type="email"
                onChange={handleEmailChange}
              />

              {!getCode && (
                <Button className="fixed bottom-12 left-0 right-0 w-64 h-16 flex items-center justify-center m-auto">
                  확인
                </Button>
              )}
            </form>
            {getCode ? (
              <div>
                <form onSubmit={handleSubmitCode}>
                  <ContentWrap className="mt-3">
                    <Content>
                      인증번호 <span id="countdown">10:00</span>
                    </Content>
                  </ContentWrap>

                  <InputText
                    className="w-80"
                    type="text"
                    onChange={handleCodeChange}
                  />
                  <Button className="fixed bottom-12 left-0 right-0 w-64 h-16 flex items-center justify-center m-auto">
                    확인
                  </Button>
                </form>
              </div>
            ) : (
              sendCode && (
                <div>
                  <Form>
                    <p className="text-center">인증번호 전송중...</p>
                  </Form>
                </div>
              )
            )}
          </>
        )}
        {change && (
          <div style={{ marginLeft: "auto", marginRight: "auto" }}>
            <form onSubmit={handleSubmitPassword}>
              <ContentWrap className="mt-3">
                <Content>새 비밀번호</Content>
              </ContentWrap>
              <InputText
                className="w-80"
                type="password"
                onChange={handlePasswordChange}
              />
              {userPwCondition === 2 ? (
                <p className="text-red-300 w-full mt-1">
                  특수, 영문, 숫자 조합으로 5-25자이어야 합니다.
                </p>
              ) : userPwCondition === 1 ? (
                <p className="text-emerald-300 w-full mt-1">유효한 비밀번호</p>
              ) : (
                <div className="h-7"></div>
              )}
              <ContentWrap className="mt-3">
                <Content>비밀번호 확인</Content>
              </ContentWrap>
              <InputText
                className="w-80"
                type="password"
                onChange={handleCheckPasswordChange}
              />
              {userPwMatch === 1 ? (
                <p className="text-red-300 mt-1">비밀번호 불일치</p>
              ) : userPwMatch === 2 ? (
                <p className="text-emerald-300 mt-1">비밀번호 일치</p>
              ) : (
                <div className="h-7"></div>
              )}
              <Button
                className="fixed bottom-12 left-0 right-0 w-64 h-16 flex items-center justify-center m-auto"
                style={{ backgroundColor: "#EFE0F4", color: "black" }}
              >
                확인
              </Button>
            </form>
          </div>
        )}
      </Box>
    </motion.div>
  )
}
