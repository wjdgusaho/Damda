import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Store from './Store'
import { Provider } from 'react-redux'
import MainPage from './components/MainPage'
import MyPage from './components/MyPage'
import ShopPage from './components/ShopPage'
import TimecapsulePage from './components/TimecapsulePage'
import Card from './components/Card'
import Friend from './components/Friend'
import Navigation from './Navigation'

function Main() {
  return (
    <div className="Main">
      <Provider store={Store}>
        <BrowserRouter>
          <Navigation/>
          <Routes>
            <Route path='/' element={<MainPage/>}></Route>
            <Route path='/user/' element={<MyPage/>}></Route>
            <Route path='/shop/' element={<ShopPage/>}></Route>
            <Route path='/timecapsule/' element={<TimecapsulePage/>}></Route>
            <Route path='/card/' element={<Card/>}></Route>
            <Route path='/friend/' element={<Friend/>}></Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default Main;
