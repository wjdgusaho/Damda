import axios from "axios"
import React, { useState, useEffect, useRef } from "react"
import tw from "tailwind-styled-components"
import { useNavigate } from "react-router"
import { Link } from "react-router-dom"
import toast, { Toaster } from "react-hot-toast"
import { motion } from "framer-motion"

// 비밀번호 정규식
const passwordRegex = /^(?=.*[a-zA-Z])[!@#$%^*+=-]?(?=.*[0-9]).{5,25}$/

const Box = tw.div`
  flex
  justify-center
  mt-10
  flex-col
`

const Form = tw.form`
  grid
  grid-cols-1
  mt-10
  mx-auto
`

const InputText = tw.input`
  bg-transparent
  focus:outline-none
  border-b-2
`

export const FindPassword = function () {
  const [userEmail, setUserEmail] = useState("")
  const [userCode, setUserCode] = useState("")
  const [getCode, setGetCode] = useState(false)
  const [change, setChange] = useState(false)
  const [password, setPassword] = useState("")
  const [checkPassword, setCheckPassword] = useState("")
  const [userPwMatch, setuserPwMatch] = useState(0)
  const [sendCode, setSendCode] = useState(false)
  const navigate = useNavigate()
  const intervalRef = useRef<NodeJS.Timeout>()

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
      <Box>
        <Toaster toastOptions={{ duration: 1000 }} />
        <div className="w-full flex justify-center">
          <Link
            to={"/login"}
            style={{ fontSize: "30px", color: "white" }}
            className="w-6 mr-72"
          >
            <svg
              className="w-6 h-6 text-black-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 8 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 1 1.3 6.326a.91.91 0 0 0 0 1.348L7 13"
              />
            </svg>
          </Link>
        </div>
        <img
          src="assets/universe/Planet-3.png"
          alt="planet"
          width={200}
          style={{ marginLeft: "auto", marginRight: "auto" }}
        />
        {!change && (
          <div style={{ marginLeft: "auto", marginRight: "auto" }}>
            <p>
              <span className="text-lilac-500">가입시 등록하신 이메일</span>로{" "}
              <br /> 비밀번호를 재설정합니다.
            </p>
            <Form onSubmit={handleSubmitEmail}>
              <p>이메일</p>
              <InputText type="email" onChange={handleEmailChange} />
              {!getCode && (
                <button
                  className="p-2 px-4 text-sm mt-20 rounded-full shadow-md w-48 mx-auto"
                  style={{ backgroundColor: "#EFE0F4", color: "black" }}
                >
                  확인
                </button>
              )}
            </Form>
            {getCode ? (
              <div>
                <Form onSubmit={handleSubmitCode}>
                  <p className="grid grid-cols-2 justify-between">
                    인증번호
                    <span id="countdown" className="text-end">
                      10:00
                    </span>
                  </p>
                  <InputText type="text" onChange={handleCodeChange} />
                  <button
                    className="p-2 px-4 text-sm mt-20 rounded-full shadow-md w-48 mx-auto"
                    style={{ backgroundColor: "#EFE0F4", color: "black" }}
                  >
                    확인
                  </button>
                </Form>
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
          </div>
        )}
        {change && (
          <div style={{ marginLeft: "auto", marginRight: "auto" }}>
            <Form onSubmit={handleSubmitPassword}>
              <p>새로운 비밀번호 입력</p>
              <InputText
                className="mb-5"
                type="password"
                onChange={handlePasswordChange}
              />
              <p>비밀번호 확인</p>
              <InputText type="password" onChange={handleCheckPasswordChange} />
              {userPwMatch === 1 ? (
                <p className="text-red-500">비밀번호 불일치</p>
              ) : userPwMatch === 2 ? (
                <p className="text-green-500">비밀번호 일치</p>
              ) : (
                <p></p>
              )}
              <button
                className="p-2 px-4 text-sm mt-20 rounded-full shadow-md w-48 mx-auto"
                style={{ backgroundColor: "#EFE0F4", color: "black" }}
              >
                확인
              </button>
            </Form>
          </div>
        )}
      </Box>
    </motion.div>
  )
}
