import React, { useState, useEffect } from "react"
import "../index.css"
import tw from "tailwind-styled-components"
import { styled } from "styled-components"
import { useNavigate } from "react-router"
import { Store } from "../store/Store"

const UserData = {
  // 주작된 데이터
  user_no: 1234,
  profile_image: "../../defalutprofile.png",
  nickname: "달토끼맛쿠키",
  now_capsule_count: 4,
  saved_capsule_count: 6,
}

const Background = styled.div`
  background-image: url("../../Background.png");
  background-size: 540px;
  /* background-position: center; */
  background-position-x: center;
  background-position-y: 60px;
  background-repeat: no-repeat;
  width: 100%;
  height: 100vh;
`

const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #e4e6f5;
  font-family: "Pretendard";
`

const MenuBtn = styled.button`
  background-color: rgba(255, 255, 255, 0.3);
  width: 297px;
  height: 70px;
  font-size: 20px;
  border-radius: 15px;
  color: #fff;
  font-weight: 100;
  margin-bottom: 25px;
  box-shadow: 0px 4px 4px #45345c;
`

const LogoutBtn = styled(MenuBtn)`
  background-color: rgba(0, 0, 0, 0.3);
`

const CloseBtn = styled(MenuBtn)`
  background-color: rgb(255, 255, 255, 0);
  box-shadow: none;
`

const Menu = function () {
  const navigate = useNavigate()

  return (
    <Background>
      <Box>
        <img
          style={{
            backgroundColor: "#AEB8E2",
            borderRadius: "50%",
            width: "70px",
            height: "70px",
            marginTop: "100px",
            marginBottom: "15px",
          }}
          src={`${UserData.profile_image}`}
          alt="defautImg"
        />
        <div style={{ fontSize: "20px", fontWeight: "300" }}>
          {UserData.nickname}
        </div>
        <div style={{ opacity: "50%", fontSize: "15px", fontWeight: "100" }}>
          #{UserData.user_no}
        </div>
        <div className="grid grid-cols-2 text-base font-thin space-x-7 mt-6">
          <div
            onClick={() => {
              navigate("/timecapsule")
            }}
            className="grid grid-rows-2 text-center"
          >
            진행중인 타임캡슐
            <div className="text-xl font-normal">
              {UserData.now_capsule_count}개
            </div>
          </div>
          <div
            onClick={() => {
              navigate("/savetimecapsule")
            }}
            className="grid grid-rows-2 text-center"
          >
            저장된 타임캡슐
            <div className="text-xl font-normal">
              {UserData.saved_capsule_count}개
            </div>
          </div>
        </div>
        <MenuBtn
          onClick={() => {
            navigate("/friend/list")
          }}
          style={{ marginTop: "35px" }}
        >
          내 친구
        </MenuBtn>
        <MenuBtn
          onClick={() => {
            navigate("/shop/sticker")
          }}
        >
          상점
        </MenuBtn>
        <MenuBtn
          onClick={() => {
            navigate("/user")
          }}
        >
          회원정보 수정
        </MenuBtn>
        <LogoutBtn
          onClick={() => {
            navigate("/logout")
          }}
        >
          로그아웃
        </LogoutBtn>
        <CloseBtn
          onClick={() => {
            navigate("/main")
          }}
        >
          닫기
        </CloseBtn>
      </Box>
    </Background>
  )
}

export default Menu
