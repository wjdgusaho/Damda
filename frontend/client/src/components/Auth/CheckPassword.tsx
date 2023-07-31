import React, { useState } from "react"
import tw from "tailwind-styled-components"
import { serverUrl } from "../../urls"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { useSelector } from "react-redux"
import { RootState } from "../../store/Store"
import { getCookieToken } from "../../store/Cookie"
import { GetNewTokens } from "./RefreshTokenApi"

const Box = tw.div`
  flex
  justify-center
  mt-10
  mx-auto
  flex-col
  text-center
  w-96
`
const InputText = tw.input`
  mt-5 ml-7 w-80
  bg-transparent
  focus:outline-none
  border-b-2
`
const Button = tw.button`bg-lilac-100 ml-24 text-black shadow-md w-48 border rounded-full mt-96 h-10`

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
    restart = true
  ) => {
    event.preventDefault()

    if (userPw) {
      axios({
        method: "POST",
        url: serverUrl + "user/info",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + Token,
        },
        data: {
          userPw: userPw,
        },
      })
        .then((response) => {
          if (response.data.code === -9004) {
            alert("비밀번호가 일치하지 않습니다. 다시 입력해주세요.")
          } else {
            navigate("/user-info", { state: response.data })
          }
          setUserPw("")
        })
        .catch(async (error) => {
          // 문제지점
          console.log("비번에러 " + error)
          if (error.response.data.message === "토큰 만료" && restart) {
            try {
              await getNewToken(getCookieToken())
              handlePwSubmit(event, false)
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
    <Box style={{ color: "#CFD4EE" }}>
      <div className="flex flex-initial justify-between">
        <Link
          to={"/menu"}
          style={{ fontSize: "30px", color: "white", marginLeft: "30px" }}
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
        <Link to={"/main"} className="grid grid-cols-2 text-center">
          <img
            style={{ marginLeft: "13px" }}
            src="/assets/icons/home.png"
            alt="home"
            width={25}
          />
          <p>홈으로</p>
        </Link>
      </div>
      <img
        src="assets/Planet-3.png"
        alt="planet"
        width={200}
        style={{ marginLeft: "auto", marginRight: "auto" }}
      />
      <div style={{ marginLeft: "auto", marginRight: "auto" }}>
        <p>
          회원님의 개인정보를 안전하게 보호하기 위해
          <br />
          <span className="text-lilac-500">2차 인증 후 변경이 가능</span>
          합니다.
        </p>
      </div>
      <form className="mt-10 text-left h-20" onSubmit={handlePwSubmit}>
        <p className="ml-7">비밀번호</p>
        <InputText className="" type="password" onChange={handlePwChange} />
        <Button>확인</Button>
      </form>
    </Box>
  )
}
