import axios from "axios"
import React, { useState, useEffect } from "react"
import tw from "tailwind-styled-components"
import { serverUrl } from "../../urls"
import { useNavigate } from "react-router"
import { Link } from "react-router-dom"

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
  const [passwordHelp, setPasswordHelp] = useState("")
  const [sendCode, setSendCode] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!checkPassword && passwordRegex.test(checkPassword)) {
      setPasswordHelp(
        "비밀번호는 최소 5자 이상, 최대 15자 미만의 특수문자를 제외한 영문, 숫자 조합입니다."
      )
    } else if (password && checkPassword) {
      if (password !== checkPassword) {
        setPasswordHelp("비밀번호가 일치하지 않습니다.")
      } else {
        setPasswordHelp("비밀번호가 일치합니다.")
      }
    }
  }, [password, checkPassword])

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
  async function sleep(sec: number) {
    return new Promise<void>((resolve) => setTimeout(resolve, sec * 1000))
  }

  function handleSubmitEmail(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSendCode(true)
    axios({
      method: "POST",
      url: serverUrl + "user/change-password/email",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        email: userEmail,
      },
    })
      .then(async (response) => {
        if(response.data.code === 200) {
          setGetCode(true)
          await sleep(1)
          startCountdown(10)
        } else {
          alert(response.data.message)
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

  function startCountdown(minute: number) {
    const countdownElement = document.querySelector(
      "#countdown"
    ) as HTMLSpanElement

    if (!countdownElement) {
      console.error("요소가 존재하지 않습니다.")
      return
    }

    seconds = minute * 60

    const interval = setInterval(() => {
      const minuteRemaining = Math.floor(seconds / 60)
      const secondRemaining = seconds % 60

      countdownElement.textContent = `${String(minuteRemaining).padStart(
        2,
        "0"
      )}:${String(secondRemaining).padStart(2, "0")}`

      if (seconds === 0) {
        clearInterval(interval)
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
      url: serverUrl + "user/change-password/code",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        email: userEmail,
        code: userCode,
      },
    })
      .then((response) => {
        if (response.data === "인증번호 일치") {
          setChange(true)
        } else if (response.data === "인증번호 불일치") {
          alert("인증번호가 일치하지 않습니다.")
        } else if (response.data === "만료시간 지남") {
          alert("인증번호가 만료되었습니다. 다시 발급해주세요.")
          navigate("/login")
        } else if (response.data === "이미 사용") {
          alert("이미 사용하신 인증번호입니다.")
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
      alert("비밀번호가 일치하지 않습니다.")
      setCheckPassword("")
    } else {
      axios({
        method: "PATCH",
        url: serverUrl + "user/change-password/new",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          email: userEmail,
          userPw: password,
        },
      })
        .then((response) => {
          if (response.data === "동일한 비밀번호") {
            alert("현재 설정한 비밀번호와 동일합니다.")
          } else if (response.data === "비밀번호 변경 성공") {
            alert("비밀번호 변경에 성공했습니다. 로그인 하세요.")
            navigate("/login")
          } else if (response.data === "비밀번호 변경에 실패") {
            alert("비밀번호 변경에 실패했습니다. 잠시 후 다시 시도해주세요.")
          }
        })
        .catch((error) => console.error(error))
    }
  }

  return (
    <Box style={{ color: "#CFD4EE" }}>
      <div className="w-full flex justify-center">

      <Link to={"/login"} style={{ fontSize: "30px", color: "white" }}
      className="w-6 mr-72">
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
          {getCode? (
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
          ) : sendCode && (
          <div>
              <Form>
                <p className="text-center">
                  인증번호 전송중...
                </p>
              </Form>
          </div>)}
        </div>
      )}
      {change && (
        <div style={{ marginLeft: "auto", marginRight: "auto" }}>
          <Form onSubmit={handleSubmitPassword}>
            <p>새로운 비밀번호 입력</p>
            <InputText type="password" onChange={handlePasswordChange} />
            <p>비밀번호 확인</p>
            <InputText type="password" onChange={handleCheckPasswordChange} />
            <p>{passwordHelp}</p>
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
  )
}
