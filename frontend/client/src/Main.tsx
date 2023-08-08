import React, { useEffect, useRef, useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { RootState } from "./store/Store"
import { useDispatch, useSelector } from "react-redux"
import { CookiesProvider } from "react-cookie"
import { EventSourcePolyfill } from "event-source-polyfill"

import MainPage from "./components/MainPage"
import { CheckPassword } from "./components/Auth/CheckPassword"
import ShopPage from "./components/ShopPage"
import TimecapsulePage from "./components/TimecapsulePage"
import Card from "./components/Card"
import Friend from "./components/Friend"
import { List, Request } from "./components/Friend"
import Login from "./components/Auth/Login"
import { SignUp } from "./components/Auth/SignUp"
import { Logout } from "./components/Auth/Logout"
import { FindPassword } from "./components/Auth/FindPassword"
import { LandingPage } from "./components/LandingPage"
import Tutorial from "./components/Tutorial"
import { DummyKakao } from "./components/Auth/DummyKakao"
import Menu from "./components/Menu"
import SavedTimecapsule from "./components/SavedTimecapsule"
import Participate from "./components/Participate"
import { UserInfoChange } from "./components/Auth/UserInfoChange"
import SelectType from "./components/SelectType"
import ClassicCapsule from "./components/ClassicCapsule"
import { ThemeProvider } from "styled-components"
import RecordCapsule from "./components/RecordCapsule"
import GoalCapsule from "./components/GoalCapsule"
import SelectTheme from "./components/SelectTheme"
import UserSearch from "./components/UserSearch"
import TimeCapsuleDetail from "./components/TimeCapsuleDetail"
import { GetNewTokens } from "./components/Auth/RefreshTokenApi"
import { getCookieToken } from "./store/Cookie"
import { SET_TOKEN } from "./store/Auth"
import { serverUrl } from "./urls"

function Main() {
  const themeState = useSelector((state: RootState) => state.theme)
  const styleElement = document.createElement("style")
  styleElement.innerHTML = `
    html {
      background: ${themeState.colorTheme} no-repeat center fixed;
      background-size: cover;
    }
  `

  document.head.appendChild(styleElement)

  const intervalTokenRef = useRef<NodeJS.Timeout>()
  const token = useSelector((state: RootState) => state.auth.accessToken)
  const intervalMs = useSelector(
    (state: RootState) => state.auth.userInfo.expiredMs
  )
  const getNewToken = GetNewTokens()
  const dispatch = useDispatch()

  useEffect(() => {
    if (token && !intervalTokenRef.current) {
      intervalTokenRef.current = setInterval(async () => {
        const newToken = getNewToken(getCookieToken())
        dispatch(SET_TOKEN(await newToken))
      }, intervalMs - 5000)
    }
    return clearInterval(intervalTokenRef.current)
  })

  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [eventSource, setEventSource] = useState<EventSource | null>(null)

  const handleOnline = () => {
    setIsOnline(true)
  }

  const handleOffline = () => {
    setIsOnline(false)
  }

  useEffect(() => {
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  useEffect(() => {
    if (token && isOnline) {
      initializeEventSource()
    } else {
      closeEventSource()
    }
  }, [token, isOnline])

  const initializeEventSource = () => {
    if (eventSource === null) {
      const newEventSource = new EventSourcePolyfill(serverUrl + "sse/login", {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      newEventSource.onmessage = (event) => {
        const res = event.data
        console.log(res)
      }
      newEventSource.onerror = (event) => {
        console.log("Error event:", event)
      }
      newEventSource.addEventListener("custom-event", (event) => {
        console.log(event)
      })
      newEventSource.addEventListener("end-of-stream", (event) => {
        console.log(event)
      })
      setEventSource(newEventSource)
    }
  }

  const closeEventSource = () => {
    if (eventSource !== null) {
      eventSource.close()
      setEventSource(null)
    }
  }

  return (
    <ThemeProvider theme={themeState}>
      <div className="Main">
        <CookiesProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />}></Route>
              <Route path="/user/" element={<CheckPassword />}></Route>
              <Route path="/user-info/" element={<UserInfoChange />}></Route>
              <Route path="/shop/" element={<ShopPage />}></Route>
              <Route path="/timecapsule/" element={<TimecapsulePage />}></Route>
              <Route path="/card/:capsuleId" element={<Card />}></Route>
              <Route path="/friend/" element={<Friend />}>
                <Route path="list" element={<List />}></Route>
                <Route path="request" element={<Request />}></Route>
              </Route>
              <Route path="/friend/search" element={<UserSearch />}></Route>
              <Route path="/login/" element={<Login />}></Route>
              <Route path="/signup/" element={<SignUp />}></Route>
              <Route path="/logout/" element={<Logout />}></Route>
              <Route path="/main/" element={<MainPage />}></Route>
              <Route path="/findPassword/" element={<FindPassword />}></Route>
              <Route path="/tutorial/" element={<Tutorial />}></Route>
              <Route path="/dummykakao/" element={<DummyKakao />}></Route>
              <Route path="/menu/" element={<Menu />}></Route>
              <Route
                path="/savetimecapsule/"
                element={<SavedTimecapsule />}
              ></Route>
              <Route path="/participate/" element={<Participate />}></Route>
              <Route path="/selecttype/" element={<SelectType />}></Route>
              <Route path="/classic/" element={<ClassicCapsule />}></Route>
              <Route path="/record/" element={<RecordCapsule />}></Route>
              <Route path="/goal/" element={<GoalCapsule />}></Route>
              <Route path="/selecttheme/" element={<SelectTheme />}></Route>
              <Route
                path="/timecapsule/detail/:capsuleId/"
                element={<TimeCapsuleDetail />}
              ></Route>
            </Routes>
          </BrowserRouter>
        </CookiesProvider>
      </div>
    </ThemeProvider>
  )
}

export default Main
