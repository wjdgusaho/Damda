import React, { useEffect, useRef, useState } from "react"
import { Routes, Route } from "react-router-dom"
import { RootState } from "./store/Store"
import { useDispatch, useSelector } from "react-redux"
import { CookiesProvider } from "react-cookie"
import { EventSourcePolyfill } from "event-source-polyfill"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import MainPage from "./components/MainPage"
import { CheckPassword } from "./components/Auth/CheckPassword"
import ShopPage from "./components/ShopPage"
import TimecapsulePage from "./components/TimecapsulePage"
import Card from "./components/Card"
import Friend from "./components/Friend"
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
import { TimecapsuleOpen } from "./components/TimecapsuleOpen"
import TimecapsuleResult from "./components/TimecapsuleResult"
import {
  ADD_FRIENDS,
  ADD_OPENTIMECAPSULES,
  ADD_TIMECAPSULES,
  DELETE_SSE,
  SET_SSE,
  alarmCapsuleType,
  alarmFriendType,
  alarmOpenCapsuleType,
  toastOption,
} from "./store/Alarm"
import { EmptyPage } from "./components/EmptyPage"
import { AnimatePresence } from "framer-motion"
import ReactTracker from "./ReactTracker"

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
  ReactTracker()

  useEffect(() => {
    if (token && !intervalTokenRef.current) {
      intervalTokenRef.current = setInterval(async () => {
        const newToken = getNewToken(getCookieToken())
        dispatch(SET_TOKEN(await newToken))
        initializeEventSource()
      }, intervalMs - 60000)
    }
    return () => {
      if (intervalTokenRef.current !== null) {
        clearInterval(intervalTokenRef.current)
      }
    }
  }, [token])

  const [isOnline, setIsOnline] = useState(navigator.onLine)
  // const [eventSource, setEventSource] = useState<EventSource | null>(null)
  const eventSource = useSelector((state: RootState) => state.alarm.eventSource)

  const handleOnline = () => {
    setIsOnline(true)
  }

  const handleOffline = () => {
    setIsOnline(false)
  }

  // useEffect 함수는 특정 상황에서 자동으로 실행되는 함수.
  // useEffect(() => {내용}) : 컴포넌트가 마운트 되었을 때 실행. 만약 내용에 return이 들어가 있다면 해당 내용은 언마운트 되었을때 실행됨.
  // useEffect(()=> {내용}, [변수]) : 변수값이 업데이트 될때마다 실행. 만약 변수가 없다면 컴포넌트가 마운트 되었을때 한번만 실행된다. 변수는 여러개를 지정할 수 있음.

  // 여기서 마운트, 언마운트의 뜻은 컴포넌트가 나타났을 때, 그리고 사라질 때를 의미한다.
  useEffect(() => {
    // 브라우저(창)의 상태를 확인하는 함수. 즉, 브라우저가 열려있는지, 닫혀있는지 확인하고, 해당 상태에 따라 isOnline의 값이 바뀐다.
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
      closeEventSource()
    }
  }, [])

  useEffect(() => {
    if (token && isOnline) {
      initializeEventSource()
    } else {
      closeEventSource()
    }
  }, [token, isOnline])

  // 이벤트소스 새롭게 시작할 함수.
  const initializeEventSource = () => {
    // 만약 sse를 시작하지 않았거나, 현재 sse가 중단된 상태라면 새롭게 실행함.
    if (eventSource === null || eventSource.readyState === EventSource.CLOSED) {
      const newEventSource = new EventSourcePolyfill(
        process.env.REACT_APP_SERVER_URL + "sse/login",
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      newEventSource.onopen = (event) => {
        console.log(event)
        const openEventSource = new EventSourcePolyfill(
          process.env.REACT_APP_SERVER_URL + "sse/login/after",
          { headers: { Authorization: "Bearer " + token } }
        )
        openEventSource.onerror = (event) => {
          console.log("open event : ", event)
        }
      }
      // 에러가 났을 때 발생하는 이벤트 함수
      newEventSource.onerror = (event) => {
        console.log("Error event : ", event)
        closeEventSource()
      }
      // addEventListener : 특정 이벤트 string 값을 서버에서 받으면 콜백함수를 실행한다.
      // 콜백함수 : (event) => {}  <-- 이렇게 쓰는게 하나의 콜백함수.
      newEventSource.addEventListener("friend-event", (event: any) => {
        const data: alarmFriendType = JSON.parse(event["data"])
        toast.info(
          `${data.fromName}#${data.fromUser}\n${data.content}\n${data.date}`,
          toastOption
        )
        dispatch(ADD_FRIENDS(data))
      })
      newEventSource.addEventListener("timecapsule-event", (event: any) => {
        const data: alarmCapsuleType = JSON.parse(event["data"])
        toast.info(
          `${data.fromName}#${data.fromUser}\n${data.content}\n${data.date}`,
          toastOption
        )
        dispatch(ADD_TIMECAPSULES(data))
      })
      newEventSource.addEventListener(
        "timecapsule-event-selfcheck",
        (event: any) => {
          const data: alarmOpenCapsuleType = JSON.parse(event["data"])
          toast.info(`${data.content}${data.title}\n${data.date}`, toastOption)
          dispatch(ADD_OPENTIMECAPSULES(data))
        }
      )
      newEventSource.addEventListener("check-connection", (event: any) => {
        // 새롭게 서버로 보낼 이벤트소스
        // process.env.REACT_APP_SERVER_URL + (내가 보낼 url 주소)
        // headers에는 토큰 값. 헤더 이외의 값 추가하려면 , 뒤에 넣을 것.
        const otherESource = new EventSourcePolyfill(
          process.env.REACT_APP_SERVER_URL + "sse/check",
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        )
        otherESource.onmessage = (event) => {
          console.log("check message : ", event)
        }
        otherESource.onerror = (event) => {
          console.log("check error : ", event)
          otherESource.close()
        }
      })
      // 장기간 미응답으로 연결을 해제하고 다시 연결함.
      newEventSource.addEventListener("end-of-stream", (event) => {
        closeEventSource()
        setTimeout(() => {
          initializeEventSource()
        }, 10000)
      })

      // 설정한 이벤트소스 재설정.
      dispatch(SET_SSE(newEventSource))
    }
  }

  const closeEventSource = () => {
    // sse를 종료할 때, eventSource가 null이라면 에러가 나므로, 미리 체크해본다.
    if (eventSource !== null && eventSource.close !== undefined) {
      // sse 종료 함수.
      eventSource.close()
      dispatch(DELETE_SSE())
    }
  }

  useEffect(() => {
    // 이미지 우클릭 방지를 위한 이벤트 핸들러 함수
    const preventContextMenu = (event: MouseEvent) => {
      event.preventDefault()
    }

    // 이미지 우클릭 이벤트 리스너 추가
    window.addEventListener("contextmenu", preventContextMenu)

    return () => {
      // 컴포넌트 언마운트 시 이벤트 리스너 제거
      window.removeEventListener("contextmenu", preventContextMenu)
    }
  }, [token, isOnline])

  return (
    <ThemeProvider theme={themeState}>
      <div className="Main">
        <ToastContainer />
        <CookiesProvider>
          {!token && (
            <AnimatePresence>
              <Routes>
                <Route path="/" element={<LandingPage />}></Route>
                <Route path="/login/" element={<Login />}></Route>
                <Route path="/signup/" element={<SignUp />}></Route>
                <Route path="/dummykakao/" element={<DummyKakao />}></Route>
                <Route path="/*" element={<EmptyPage />}></Route>
                <Route path="/findPassword/" element={<FindPassword />}></Route>
              </Routes>
            </AnimatePresence>
          )}
          {token && (
            <AnimatePresence>
              <Routes>
                <Route path="/*" element={<EmptyPage />}></Route>
                <Route path="/" element={<LandingPage />}></Route>
                <Route path="/user/" element={<CheckPassword />}></Route>
                <Route path="/user-info/" element={<UserInfoChange />}></Route>
                <Route path="/shop/" element={<ShopPage />}></Route>
                <Route
                  path="/timecapsule/"
                  element={<TimecapsulePage />}
                ></Route>
                <Route path="/card/:capsuleId" element={<Card />}></Route>
                <Route path="/friend/" element={<Friend />}></Route>
                <Route path="/friend/search" element={<UserSearch />}></Route>
                <Route path="/login/" element={<Login />}></Route>
                <Route path="/signup/" element={<SignUp />}></Route>
                <Route
                  path="/logout/"
                  element={<Logout intervalTokenRef={intervalTokenRef} />}
                ></Route>
                <Route path="/main/" element={<MainPage />}></Route>
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
                <Route
                  path="/timecapsule/open/:capsuleId/"
                  element={<TimecapsuleOpen />}
                ></Route>
                <Route
                  path="/timecapsule/result/:capsuleId/"
                  element={<TimecapsuleResult />}
                ></Route>
              </Routes>
            </AnimatePresence>
          )}
        </CookiesProvider>
      </div>
    </ThemeProvider>
  )
}

export default Main
