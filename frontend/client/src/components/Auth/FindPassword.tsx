import axios from "axios"
import React, { useState, useEffect } from "react"
import tw from "tailwind-styled-components"
import { serverUrl } from "../../urls"

const Box = tw.div`
  flex
  justify-center
  mt-10
  flex-col
`

const Form = tw.form`
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

  useEffect(() => {
    if (!checkPassword) {
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

  function handleSubmitEmail(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
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
      .then((response) => {
        setGetCode(true)
      })
      .catch((error) => console.error(error))
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
        verification_code: userCode,
      },
    })
      .then((response) => {
        setChange(true)
      })
      .catch((error) => console.error(error))
  }
  function handleSubmitPassword(event: React.FormEvent<HTMLFormElement>) {
    if (password !== checkPassword) {
      alert("비밀번호가 일치하지 않습니다.")
      setCheckPassword("")
    } else {
      axios({
        method: "POST",
        url: serverUrl + "user/change-password/new",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          email: userEmail,
          password: password,
        },
      })
        .then((response) => {
          console.log(response)
        })
        .catch((error) => console.error(error))
    }
  }

  return (
    <Box style={{ color: "#CFD4EE" }}>
      <img
        src="assets/Planet-3.png"
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
          </Form>
          {getCode && (
            <Form onSubmit={handleSubmitCode}>
              <p>인증번호</p>
              <InputText type="text" onChange={handleCodeChange} />
            </Form>
          )}
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
          </Form>
        </div>
      )}
    </Box>
  )
}
