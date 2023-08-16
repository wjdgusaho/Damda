import React, { useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { getCookieToken, removeCookieToken } from "../../store/Cookie"
import { DELETE_TOKEN, DELETE_USER } from "../../store/Auth"
import { SET_THEME } from "../../store/Theme"
import { DELETE_TIMECAPSULE } from "../../store/Timecapsule"
import { EventSourcePolyfill } from "event-source-polyfill"
import { RootState } from "../../store/Store"

export const Logout = function () {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const token = useSelector((state: RootState) => state.auth.accessToken)
  const eventSource = useSelector((state: RootState) => state.alarm.eventSource)

  useEffect(() => {
    if (eventSource !== null) {
      const logoutEvent = new EventSourcePolyfill(
        process.env.REACT_APP_SERVER_URL + "sse/logout",
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      logoutEvent.onerror = (event) => {
        logoutEvent.close()
      }
    }
    axios({
      method: "POST",
      url: process.env.REACT_APP_SERVER_URL + "user/logout",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + getCookieToken(),
      },
      data: {},
    })
      .then(() => {
        dispatch(DELETE_TOKEN())
        dispatch(DELETE_USER())
        dispatch(SET_THEME(1))
        dispatch(DELETE_TIMECAPSULE())
        removeCookieToken()
        navigate("/login")
      })
      .catch((error) => console.error(error))
  }, [])

  return <div></div>
}
