import React, { useState } from "react"
import { useNavigate } from "react-router"
import { useDispatch } from "react-redux"
import { styled } from "styled-components"
import axios from "axios"
import { serverUrl, reqUrl } from "../../urls"
import { SET_TOKEN } from "../../store/Auth"
import { setRefreshToken } from "../../store/Cookie"
import "../../index.css"

const Box = styled.div`
  display: flex;
  justify-content: center;
  width: 300px;
  flex-wrap: wrap;
  margin-left: auto;
  margin-right: auto;
  margin-top: 90px;
  margin-bottom: -200px;
  /* animation: 3s ease-in-out 0s 1 alternate show-image; */
`

const Form = styled.form`
  /* display: flex;
  flex-wrap: wrap; */
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
  left: 80px;
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
  top: -230px;
  left: 0px;
`

const Shooting1 = styled.img`
  position: relative;
  top: 10px;
  left: -100px;
  width: 65px;
  height: 65px;
`
const Shooting2 = styled.img`
  position: relative;
  top: -10px;
  left: -55px;
  width: 41px;
  height: 41px;
`
const Shooting3 = styled.img`
  position: relative;
  top: 80px;
  left: 100px;
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
        password: password,
      },
    })
      .then((response) => {
        if (response.data === "no user") {
          setUserdataText("아이디가 존재하지 않습니다.")
        } else if (response.data === "fail password") {
          setUserdataText("비밀번호가 일치하지 않습니다.")
        } else {
          setRefreshToken(response.data.refreshToken)
          dispatch(SET_TOKEN(response.data.accessToken))
          navigate("/tutorial")
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  return (
    <>
      <Box>
        <Shooting1 src="assets/Shooting.png" alt="Shooting" />
        <Shooting2 src="assets/Shooting.png" alt="Shooting" />
        <Shooting3 src="assets/Shooting.png" alt="Shooting" />
        <img src="damda.png" alt="logo" />
        <p
          className="text-victoria-400"
          style={{
            fontFamily: "PyeongChangPeace",
            // opacity: "50%",
            marginTop: "30px",
            marginBottom: "-20px",
          }}
        >
          우리의 추억을 타임캡슐에 담아요어쩌구
        </p>
        <img src="assets/UFO.png" alt="UFO" width="250px" height="250px" />
        <Person
          src="assets/Astronaut-1.png"
          alt="Astronaut"
          width="130px"
          height="130px"
        />
        <Shadow />

        <div>
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
                <p style={{ color: "red" }}>{userdataText}</p>
              </div>
              <div className="flex grid-cols-2 justify-between">
                <div style={{ marginLeft: "-15px" }}>
                  <button
                    onClick={() => {
                      navigate("/changepassword")
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
                <LoginBtn>로그인</LoginBtn>
              </div>
            </div>
          </Form>
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
    </>
  )
}

export default Login
