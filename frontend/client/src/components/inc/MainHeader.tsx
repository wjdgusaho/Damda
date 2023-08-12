import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { styled } from "styled-components"
import tw from "tailwind-styled-components"
import Modal from "react-modal"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../store/Store"
// import axios from "axios"
// import { serverUrl } from "../../urls"
import {
  DELETE_TIMECAPSULES,
  alarmCapsuleType,
  alarmFriendType,
} from "../../store/Alarm"

const TextStyle = styled.p`
  font-family: "pretendard";
  font-weight: 300;
  color: ${(props) => props.theme.colorCommon};
  opacity: 80%;
`
const ThemeBtn = styled.div`
  background-image: url(${(props) =>
    props.theme.colorCommon === "black"
      ? "assets/icons/themeBtnD.png"
      : "assets/icons/themeBtnL.png"});
  background-repeat: no-repeat;
  background-size: cover;
  width: 83px;
  height: 30px;
`
const AlermIcon = styled.div`
  background-image: url(${(props) =>
    props.theme.colorCommon === "black"
      ? "assets/icons/alermD.png"
      : "assets/icons/alermL.png"});
  background-repeat: no-repeat;
  background-size: cover;
  width: 25px;
  height: 25px;
`
const MenuIcon = styled.div`
  background-image: url(${(props) =>
    props.theme.colorCommon === "black"
      ? "assets/icons/hamburgerD.png"
      : "assets/icons/hamburgerL.png"});
  background-repeat: no-repeat;
  background-size: cover;
  width: 25px;
  height: 25px;
`
const RefreshIcon = styled.div`
  background-image: url(${(props) =>
    props.theme.colorCommon === "black"
      ? "assets/icons/refreshD.png"
      : "assets/icons/refreshL.png"});
  background-repeat: no-repeat;
  background-size: cover;
  width: 25px;
  height: 25px;
`

const AlertImg = styled.img`
  width: 60px;
  height: 60px;
`

const customStyles = {
  content: {
    top: "20%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    width: "330px",
    border: "0px",
    backgroundColor: "rgba(255,255,255,0)",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
}

const ModalCard = tw.div`
  mt-5 p-3 text-lilac-900 bg-white opacity-80 rounded-3xl shadow-2xl
  inline-flex items-center flex-wrap
  w-72
`

const ModalBtn = tw.button`
  mx-auto shadow-xl
`

const AlarmFriendComponent = function ({
  friend,
}: {
  friend: alarmFriendType
}) {
  const navigate = useNavigate()

  const handleMove = () => {
    navigate("/friend/list")
  }
  return (
    <ModalCard style={{ fontFamily: "Pretendard", fontWeight: "600" }}>
      <div>
        <AlertImg src={friend.fromProfileImage} alt="defalut" />
      </div>
      <div className="ml-2" style={{ width: "150px" }}>
        <p>
          <span className="text-lilac-600 font-bold">{friend.fromName}</span>
          <span className="text-gray-400">#{friend.fromUser}</span>
          {friend.content}
        </p>
      </div>
      <div>
        <ModalBtn onClick={handleMove}>친구 페이지로 이동하기</ModalBtn>
      </div>
    </ModalCard>
  )
}

const AlarmTimecapsuleComponent = function ({
  timecapsule,
}: {
  timecapsule: alarmCapsuleType
}) {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleMove = () => {
    dispatch(DELETE_TIMECAPSULES(timecapsule.timecapsuleNo))
    navigate("/timecapsule/detail/" + timecapsule.timecapsuleNo)
  }
  return (
    <ModalCard style={{ fontFamily: "Pretendard", fontWeight: "600" }}>
      <div>
        <AlertImg src={"assets/" + timecapsule.capsuleIconNo} alt="defalut" />
      </div>
      <div className="ml-2" style={{ width: "150px" }}>
        <p>{timecapsule.name}</p>
      </div>
      <div>
        <ModalBtn onClick={handleMove}>타임캡슐 확인하기</ModalBtn>
      </div>
    </ModalCard>
  )
}

export const MainHeader = function () {
  const navigate = useNavigate()
  const [modalOpen, setModalOpen] = useState(false)
  const alarmFriendData = useSelector((state: RootState) => state.alarm.friends)
  const alarmTimecapsuleData = useSelector(
    (state: RootState) => state.alarm.timecapsules
  )
  const token = useSelector((state: RootState) => state.auth.accessToken)

  const handleClose = () => {
    setModalOpen(false)
  }

  return (
    <div>
      <Modal
        isOpen={modalOpen}
        onRequestClose={handleClose}
        style={customStyles}
      >
        <div className="flex justify-end">
          <button onClick={handleClose}>
            <img src="assets/icons/cancel.png" alt="cancel" />
          </button>
        </div>
        <div>
          {alarmFriendData.length === 0 &&
            alarmTimecapsuleData.length === 0 && (
              <ModalCard
                style={{ fontFamily: "Pretendard", fontWeight: "600" }}
              >
                <div>
                  <AlertImg src="assets/icons/popup.png" alt="defalut" />
                </div>
                <div className="ml-2" style={{ width: "150px" }}>
                  <p>받은 알람이 없습니다.</p>
                </div>
              </ModalCard>
            )}
          {alarmFriendData.length !== 0 && (
            <div>
              {alarmFriendData.map((friend: alarmFriendType) => (
                <AlarmFriendComponent key={friend.fromUser} friend={friend} />
              ))}
            </div>
          )}
          {alarmTimecapsuleData.length !== 0 && (
            <div>
              {alarmTimecapsuleData.map((timecapsule: alarmCapsuleType) => (
                <AlarmTimecapsuleComponent
                  key={timecapsule.timecapsuleNo}
                  timecapsule={timecapsule}
                />
              ))}
            </div>
          )}
        </div>
      </Modal>
      <div className="w-10/12 m-auto mt-12 flex justify-between">
        <ThemeBtn
          className="flex justify-center items-center w-20 rounded-lg"
          onClick={() => {
            navigate("/selecttheme")
          }}
        />
        <div className="flex items-center">
          <AlermIcon
            className="mr-6"
            onClick={() => {
              setModalOpen(true)
            }}
          />
          <MenuIcon
            onClick={() => {
              navigate("/menu")
            }}
            className="h-6"
          />
        </div>
      </div>
      {/* <div className="flex items-center justify-end mr-8 mt-8">
        <TextStyle className="opacity-80 mr-2">
          날씨, 위치 업데이트 하기
        </TextStyle>
        <RefreshIcon className="h-7" />
      </div> */}
    </div>
  )
}
