import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Store from "./store/Store"
import { Provider } from "react-redux"
import { CookiesProvider } from "react-cookie"

import MainPage from "./components/MainPage"
import { CheckPassword } from "./components/Auth/CheckPassword"
import ShopPage from "./components/ShopPage"
import { Sticker, Theme, Capsule } from "./components/ShopPage"
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

function Main() {
  return (
    <div className="Main">
      <CookiesProvider>
        <Provider store={Store}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />}></Route>
              <Route path="/user/" element={<CheckPassword />}></Route>
              <Route path="/user-info/" element={<UserInfoChange />}></Route>
              <Route path="/shop/" element={<ShopPage />}>
                <Route path="sticker" element={<Sticker />}></Route>
                <Route path="theme" element={<Theme />}></Route>
                <Route path="capsule" element={<Capsule />}></Route>
              </Route>
              <Route path="/timecapsule/" element={<TimecapsulePage />}></Route>
              <Route path="/card/" element={<Card />}></Route>
              <Route path="/friend/" element={<Friend />}>
                <Route path="list" element={<List />}></Route>
                <Route path="request" element={<Request />}></Route>
              </Route>
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
            </Routes>
          </BrowserRouter>
        </Provider>
      </CookiesProvider>
    </div>
  )
}

export default Main
