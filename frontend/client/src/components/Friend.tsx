import React, { useState, useRef, useEffect } from "react"
import { SubHeader } from "./inc/SubHeader"
import { styled } from "styled-components"
import { NavLink, Navigate, Outlet, Link } from "react-router-dom"
import Modal from "react-modal"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { serverUrl } from "../urls"
import { useSelector } from "react-redux"
import { RootState } from "../store/Store"

const Friend = function () {
  return (
    <div>
      <SubHeader></SubHeader>
      <div>
        <div className="text-center mt-10">
          <TextStyle className="text-xl">내 친구</TextStyle>
        </div>
        <div className="flex">
          <Link to="/friend/search" className="w-6 ml-auto mr-14">
            <img src="/assets/icons/friendAdd.png" alt="add" />
          </Link>
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
  const [friendList, setFriendList] = useState([])
  const token = useSelector((state: RootState) => state.auth.accessToken)
  useEffect(() => {
    axios({
      method: "GET",
      url: serverUrl + "friend/list",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => {
        setFriendList(response.data.data.result)
      })
      .catch((error) => console.error(error))
  }, [])
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
          {friendList.map((f: FriendType) => (
            <FriendCard key={f.id} friend={f}></FriendCard>
          ))}
        </div>
      )}
    </div>
  )
}

export const Request = function () {
  const [requestList, setRequestList] = useState([])
  const token = useSelector((state: RootState) => state.auth.accessToken)
  useEffect(() => {
    axios({
      method: "GET",
      url: serverUrl + "friend/request",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => {
        // setRequestList(response.data.data.result)
      })
      .catch((error) => console.error(error))
  }, [])
  return (
    <div>
      {requestList.length === 0 && (
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
      {requestList.length !== 0 && (
        <div>
          {requestList.map((f: FriendType) => (
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
      <img
        className="w-16 rounded-full h-16"
        src={friend.profileImage}
        alt="프로필사진"
      />
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
      <img className="w-16" src={friend.profileImage} alt="프로필사진" />
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

const TextStyle = styled.div`
  font-family: "pretendard";
  font-weight: 400;
  color: ${(props) => props.theme.colorCommon};
`
const CapsuleShadow = styled.div`
  width: 205px;
  height: 80px;
  border-radius: 50%;
  background: ${(props) => props.theme.colorShadow};
  filter: blur(5px);
`

const NavLink2 = styled(NavLink)`
  position: relative;
  text-decoration: none;
  font-family: "pretendard";
  font-weight: 200;
  color: ${(props) => props.theme.colorCommon};
  transition: color 0.2s;
  display: inline-flex;
  align-items: center; /* Align the text and underline vertically */
  width: 120px;
  justify-content: center;
  &.active {
    font-weight: 400;
    color: ${(props) => props.theme.colorCommon};

    &::after {
      content: "";
      position: absolute;
      bottom: -10px; /* Adjust the value to control the underline's position */
      width: 100%;
      height: 1px;
      background-color: ${(props) => props.theme.colorCommon};
    }
  }
`

type FriendType = {
  id: number
  nickname: string
  profileImage: string
  isFavorite: boolean
}

export default Friend
