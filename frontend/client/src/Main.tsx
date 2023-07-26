import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Store from "./store/Store"
import { Provider } from "react-redux"
import { CookiesProvider } from "react-cookie"

import MainPage from "./components/MainPage"
import MyPage from "./components/MyPage"
import ShopPage from "./components/ShopPage"
import { Sticker, Theme, Capsule } from "./components/ShopPage"
import TimecapsulePage from "./components/TimecapsulePage"
import Card from "./components/Card"
import Friend from "./components/Friend"
import Login from "./components/Auth/Login"
import { SignUp } from "./components/Auth/SignUp"
import { Logout } from "./components/Auth/Logout"
import { ChangePassword } from "./components/Auth/ChangePassword"
import { LandingPage } from "./components/LandingPage"
import Navigation from "./Navigation"
import Tutorial from "./components/Tutorial"
import { DummyKakao } from "./components/Auth/DummyKakao"
import Menu from "./components/Menu"
import SavedTimecapsule from "./components/SavedTimecapsule"

function Main() {
  return (
    <div className="Main">
      <CookiesProvider>
        <Provider store={Store}>
          <BrowserRouter>
            {/* <Navigation/> */}
            <Routes>
              <Route path="/" element={<LandingPage />}></Route>
              <Route path="/user/" element={<MyPage />}></Route>
              <Route path="/shop/" element={<ShopPage />}>
                <Route path="sticker" element={<Sticker />}></Route>
                <Route path="theme" element={<Theme />}></Route>
                <Route path="capsule" element={<Capsule />}></Route>
              </Route>
              <Route path="/timecapsule/" element={<TimecapsulePage />}></Route>
              <Route path="/card/" element={<Card />}></Route>
              <Route path="/friend/" element={<Friend />}></Route>
              <Route path="/login/" element={<Login />}></Route>
              <Route path="/signup/" element={<SignUp />}></Route>
              <Route path="/logout/" element={<Logout />}></Route>
              <Route path="/main/" element={<MainPage />}></Route>
              <Route
                path="/changepassword/"
                element={<ChangePassword />}
              ></Route>
              <Route path="/tutorial/" element={<Tutorial />}></Route>
              <Route path="/dummykakao/" element={<DummyKakao />}></Route>
              <Route path="/menu/" element={<Menu />}></Route>
              <Route
                path="/savetimecapsule/"
                element={<SavedTimecapsule />}
              ></Route>
            </Routes>
          </BrowserRouter>
        </Provider>
      </CookiesProvider>
    </div>
  )
}

export default Main
