import React, { useState } from "react"
import { useNavigate } from "react-router"
import { useDispatch } from "react-redux"
import { styled } from "styled-components"
import axios from "axios"
import { serverUrl, reqUrl } from "../../urls"
import { SET_TOKEN, SET_USER } from "../../store/Auth"
import { setRefreshToken } from "../../store/Cookie"
import "../../index.css"

const Box = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 300px;
  height: 100vh;
  margin: auto;
`

const Form = styled.form`
  width: 300px;
  margin-left: auto;
  margin-right: auto;
  font-family: "Pretendard";
  font-display: swap;
  margin-top: -190px;
`

const Person = styled.img`
  position: relative;
  top: -180px;
  left: 180px;
`

const Shadow = styled.div`
  z-index: -1;
  background-color: black;
  position: relative;
  width: 220px;
  height: 60px;
  opacity: 0.15;
  border-radius: 50%;
  box-shadow: 0px 0px 10px 20px black;
  top: -240px;
  left: 50%;
  margin-left: -110px;
`

const Shooting1 = styled.img`
  position: absolute;
  top: -40px;
  left: -90px;
  width: 65px;
  height: 65px;
`
const Shooting2 = styled.img`
  position: absolute;
  top: -70px;
  left: 15px;
  width: 41px;
  height: 41px;
`
const Shooting3 = styled.img`
  position: absolute;
  top: 20px;
  left: 210px;
  width: 65px;
  height: 65px;
`

const KakaoLink = styled(Form)`
  img {
    margin-top: 40px;
    margin-left: auto;
    margin-right: auto;
  }
`

const InputText = styled.input`
  width: 229px;
  height: 37px;
  background-color: #f6eef9;
  color: #63376c;
  font-weight: 400;
  border-radius: 8px;
  margin-bottom: 30px;
  margin-left: -90px;
  padding-left: 10px;
`

const LoginBtn = styled.button`
  width: 110px;
  height: 33px;
  background-color: #f6eef9;
  color: #441f4c;
  border-radius: 30px;
  font-weight: 400;
  box-shadow: 0px 4px 4px #534177;
  margin-right: 12px;
  margin-top: -7px;
`

const Login = function () {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [userdataText, setUserdataText] = useState("")

  const navigate = useNavigate()
  const dispatch = useDispatch()

  function inputEmail(e: React.FormEvent<HTMLInputElement>) {
    setEmail(e.currentTarget.value)
  }
  function inputPassword(e: React.FormEvent<HTMLInputElement>) {
    setPassword(e.currentTarget.value)
  }

  function formSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    axios({
      method: "POST",
      url: serverUrl + "user/login/",
      data: {
        email: email,
        userPw: password,
      },
    })
      .then((response) => {
        if (
          response.data.code === -9000 ||
          response.data.code === -9004 ||
          response.data.code === -9005
        ) {
          setUserdataText(response.data.message)
        } else {
          const { accessToken, refreshToken, ...userInfo } = response.data.data
          setRefreshToken(refreshToken)
          dispatch(SET_TOKEN(accessToken))
          dispatch(SET_USER(userInfo))
          navigate("/tutorial")
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  return (
    <Box>
      <p className="text-red-500">죽어라</p>
      <span
        className="text-victoria-200 text-8xl mt-12"
        style={{ fontFamily: "PyeongChangPeaceBold", position: "relative" }}
      >
        담다
        <Shooting1 src="assets/Shooting.png" alt="Shooting" />
        <Shooting2 src="assets/Shooting.png" alt="Shooting" />
        <Shooting3 src="assets/Shooting.png" alt="Shooting" />
      </span>
      <p
        className="text-victoria-400 mt-5"
        style={{
          fontFamily: "PyeongChangPeace",
          fontSize: "18px",
        }}
      >
        우리의 추억을 타임캡슐에 담아요어쩌구
      </p>
      <div style={{ marginTop: "-20px" }}>
        <img src="assets/UFO.png" alt="UFO" width="300px" height="169px" />
        <Person
          src="assets/Astronaut-1.png"
          alt="Astronaut"
          width="130px"
          height="130px"
        />
        <Shadow />
      </div>

      <div>
        <div
          className="text-lilac-300 font-thin relative -top-9 w-48"
          style={{ marginLeft: "-15px" }}
        >
          <button
            onClick={() => {
              navigate("/findPassword")
            }}
          >
            비밀번호 찾기 |
          </button>
          <button
            onClick={() => {
              navigate("/signup")
            }}
            style={{ marginLeft: "5px" }}
          >
            회원가입
          </button>
        </div>
        <Form onSubmit={formSubmit} className="text-lilac-300 font-thin">
          <div className="grid gird-rows-4">
            <div
              className="grid grid-cols-2 text-lg"
              style={{ width: "300px" }}
            >
              <label htmlFor="email-input" style={{ marginLeft: "-15px" }}>
                이메일
              </label>
              <InputText
                id="email-input"
                type="text"
                value={email}
                onChange={inputEmail}
              />
            </div>
            <div className="grid grid-cols-2 text-lg">
              <label htmlFor="password-input" style={{ marginLeft: "-15px" }}>
                비밀번호
              </label>
              <InputText
                id="password-input"
                type="password"
                value={password}
                onChange={inputPassword}
              />
            </div>
            <div className="flex grid-cols-2 justify-end">
              <LoginBtn>로그인</LoginBtn>
            </div>
          </div>
        </Form>
        <p style={{ color: "red" }} className="relative -left-4">
          {userdataText}
        </p>
        <KakaoLink as="a" href={reqUrl}>
          <img
            src="kakao_login_medium_narrow1.png"
            alt="카카오톡 로그인"
            width="200px"
            height="50px"
          />
        </KakaoLink>
      </div>
    </Box>
  )
}

export default Login
