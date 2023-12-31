import axios from "axios"
import React, { useEffect } from "react"
import { setRefreshToken } from "../../store/Cookie"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { SET_USER, SET_TOKEN } from "../../store/Auth"
import { SET_THEME } from "../../store/Theme"
import toast, { Toaster } from "react-hot-toast"

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
        url: process.env.REACT_APP_SERVER_URL + "api/kakao/login",
        headers: {
          "Content-Type": "application/json",
        },
        data: { code: code },
      })
        .then((response) => {
          toast(response.data.message)
          if (response.data.code === 200) {
            const { accessToken, refreshToken, ...userInfo } =
              response.data.data
            setRefreshToken(refreshToken)
            dispatch(SET_TOKEN(accessToken))
            dispatch(SET_USER(userInfo))
            dispatch(SET_THEME(userInfo.nowTheme))
            navigate("/tutorial")
          }
        })
        .catch((err) => console.error(err))
    }
  }, [code])

  return (
    <div>
      <Toaster toastOptions={{ duration: 1000 }} />
    </div>
  )
}
