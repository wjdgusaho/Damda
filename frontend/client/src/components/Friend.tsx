import React, { useState, useRef } from "react"
import { SubHeader } from "./inc/SubHeader"
import { styled } from "styled-components"
import { NavLink, Navigate, Outlet } from "react-router-dom"
import Modal from "react-modal"
import { useNavigate } from "react-router-dom"

const Friend = function () {
  return (
    <div>
      <SubHeader></SubHeader>
      <div className="text-white">
        <div className="text-center mt-10">
          <TextStyle className="text-xl">내 친구</TextStyle>
        </div>
        <div className="flex">
          <img
            className="w-6 ml-auto mr-14"
            src="/assets/icons/friendAdd.png"
            alt=""
          />
        </div>
      </div>
      <div className="flex justify-evenly mt-6 mb-8">
        <NavLink2 to="/friend/list">친구 목록</NavLink2>
        <NavLink2 to="/friend/request">받은 친구 요청</NavLink2>
      </div>
      <Outlet />
    </div>
  )
}

export const List = function () {
  return (
    <div>
      {friendList.length === 0 && (
        <div className="text-center mt-20">
          <TextStyle className="text-victoria-400">
            친구를 찾으러 떠나볼까요?
          </TextStyle>
          <img
            className="w-72 m-auto mt-12"
            src="/assets/Astronaut-4.png"
            alt="Astronaut-3"
          />
          <CapsuleShadow className="m-auto !h-12 !w-40"></CapsuleShadow>
        </div>
      )}
      {friendList.length !== 0 && (
        <div>
          {friendList.map((f) => (
            <FriendCard key={f.id} friend={f}></FriendCard>
          ))}
        </div>
      )}
    </div>
  )
}

export const Request = function () {
  return (
    <div>
      {friendList.length === 0 && (
        <div className="text-center mt-20">
          <TextStyle className="text-victoria-400">
            친구요청이 없어요... 아직은요!
          </TextStyle>
          <img
            className="w-72 m-auto mt-12"
            src="/assets/Astronaut-4.png"
            alt="Astronaut-3"
          />
          <CapsuleShadow className="m-auto !h-12 !w-40"></CapsuleShadow>
        </div>
      )}
      {friendList.length !== 0 && (
        <div>
          {friendList.map((f) => (
            <RequestCard key={f.id} friend={f}></RequestCard>
          ))}
        </div>
      )}
    </div>
  )
}

const FriendCard = function ({ friend }: { friend: FriendType }) {
  return (
    <div className="flex w-10/12 items-center m-auto p-2">
      <img className="w-16" src={friend.profile_image} alt="프로필사진" />
      <TextStyle className="ml-4 text-white">{friend.nickname}</TextStyle>
      <div className="flex ml-auto mr-3">
        {friend.isFavorite ? (
          <img
            className="w-5 mr-4"
            src="/assets/icons/star.png"
            alt="즐겨찾기"
          />
        ) : (
          <img
            className="w-5 mr-4 opacity-10"
            src="/assets/icons/star.png"
            alt="즐겨찾기"
          />
        )}
        <img className="w-5" src="/assets/icons/button_x.png" alt="삭제" />
      </div>
    </div>
  )
}
const RequestCard = function ({ friend }: { friend: FriendType }) {
  return (
    <div className="flex w-10/12 items-center m-auto p-2">
      <img className="w-16" src={friend.profile_image} alt="프로필사진" />
      <TextStyle className="ml-4 text-white">{friend.nickname}</TextStyle>
      <div className="flex ml-auto mr-3">
        <img
          className="w-5 mr-4"
          src="/assets/icons/button_check.png"
          alt="즐겨찾기"
        />
        <img className="w-5" src="/assets/icons/button_x.png" alt="삭제" />
      </div>
    </div>
  )
}

const TextStyle7 = styled.div`
  font-family: "pretendard";
  font-weight: 700;
`
const TextStyle5 = styled.div`
  font-family: "pretendard";
  font-weight: 500;
`
const TextStyle3 = styled.div`
  font-family: "pretendard";
  font-weight: 300;
`
const TextStyle = styled.div`
  font-family: "pretendard";
  font-weight: 400;
`
const CapsuleShadow = styled.div`
  width: 205px;
  height: 80px;
  border-radius: 50%;
  background: #513a71;
  filter: blur(5px);
`

const NavLink2 = styled(NavLink)`
  position: relative;
  text-decoration: none;
  font-family: "pretendard";
  font-weight: 200;
  color: #ffffffac;
  transition: color 0.2s;
  display: inline-flex;
  align-items: center; /* Align the text and underline vertically */
  width: 120px;
  justify-content: center;
  &.active {
    font-weight: 400;
    color: #ffffff;

    &::after {
      content: "";
      position: absolute;
      bottom: -10px; /* Adjust the value to control the underline's position */
      width: 100%;
      height: 1px;
      background-color: #ffffff;
    }
  }
`

type FriendType = {
  id: string
  nickname: string
  profile_image: string
  isFavorite: boolean
}

const friendList: FriendType[] = [
  {
    id: "1",
    nickname: "달토끼맛쿠키",
    profile_image: "/assets/icons/popup.png",
    isFavorite: true,
  },
  {
    id: "2",
    nickname: "달토끼맛쿠키",
    profile_image: "/assets/icons/popup.png",
    isFavorite: true,
  },
  {
    id: "3",
    nickname: "달토끼맛쿠키",
    profile_image: "/assets/icons/popup.png",
    isFavorite: true,
  },
  {
    id: "4",
    nickname: "달토끼맛쿠키",
    profile_image: "/assets/icons/profile_1.png",
    isFavorite: false,
  },
  {
    id: "5",
    nickname: "달토끼맛쿠키",
    profile_image: "/assets/icons/profile_1.png",
    isFavorite: false,
  },
  {
    id: "6",
    nickname: "달토끼맛쿠키",
    profile_image: "/assets/icons/profile_1.png",
    isFavorite: false,
  },
]

export default Friend
