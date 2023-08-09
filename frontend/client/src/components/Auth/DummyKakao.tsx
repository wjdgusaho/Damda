import axios from "axios"
import React, { useEffect } from "react"
import { serverUrl } from "../../urls"
import { setRefreshToken } from "../../store/Cookie"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { SET_USER, SET_TOKEN } from "../../store/Auth"

export const DummyKakao = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const getParameter = (key: string) => {
    return new URLSearchParams(window.location.search).get(key)
  }
  const code = getParameter("code")

  useEffect(() => {
    if (code) {
      axios({
        method: "POST",
        url: serverUrl + "api/kakao/login",
        headers: {
          "Content-Type": "application/json",
        },
        data: { code: code },
      })
        .then((response) => {
          console.log(response)

          // if (response.data.accessToken) {
          //   setRefreshToken(response.data.refreshToken)
          //   dispatch(SET_TOKEN(response.data.accessToken))
          //   dispatch(SET_USER(response.data.accountType))
          //   navigate("/main")
          // } else {
          //   const data = {
          //     message:
          //       "카카오 로그인에 실패하셨습니다. 다시 시도해주시거나, 서비스 회원가입 진행을 해주세요.",
          //   }
          //   navigate("/login", { state: data })
          // }
        })
        .catch((err) => console.error(err))
    }
  }, [code])

  return <div></div>
}
