import axios from "axios"
import React, { useEffect } from "react"
import { serverUrl } from "../../urls"
import { setRefreshToken } from "../../store/Cookie"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { SET_USER, SET_TOKEN } from "../../store/Auth"
import {
  changeHeartTheme,
  changeMarbleTheme,
  changeUniverseDarkTheme,
  changeUniverseLightTheme,
} from "../../store/Theme"

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
          alert(response.data.message)
          if (response.data.code === 200) {
            const { accessToken, refreshToken, ...userInfo } =
              response.data.data
            setRefreshToken(refreshToken)
            dispatch(SET_TOKEN(accessToken))
            dispatch(SET_USER(userInfo))
            if (userInfo.nowTheme === 0) {
              dispatch(changeUniverseDarkTheme())
            } else if (userInfo.nowTheme === 1) {
              dispatch(changeUniverseLightTheme())
            } else if (userInfo.nowTheme === 2) {
              dispatch(changeHeartTheme())
            } else if (userInfo.nowTheme === 3) {
              dispatch(changeMarbleTheme())
            }
            navigate("/tutorial")
          }
        })
        .catch((err) => console.error(err))
    }
  }, [code])

  return <div></div>
}
