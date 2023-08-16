import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { styled } from "styled-components"
import tw from "tailwind-styled-components"
import Modal from "react-modal"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../store/Store"
import {
  DELETE_ALARM_ALL,
  DELETE_FRIENDS,
  DELETE_OPENTIMECAPSULES,
  DELETE_TIMECAPSULES,
  alarmCapsuleType,
  alarmFriendType,
  alarmOpenCapsuleType,
} from "../../store/Alarm"
import "./MainHeader.css"
import axios from "axios"
import { toast } from "react-toastify"

// const TextStyle = styled.p`
//   font-family: "pretendard";
//   font-weight: 300;
//   color: ${(props) => props.theme.colorCommon};
//   opacity: 80%;
// `
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

  &:hover {
    animation: 1s ease-in-out infinite shake;
  }

  @keyframes shake {
    0%,
    100% {
      transform: translateX(0);
    }
    10%,
    30%,
    50%,
    70%,
    90% {
      transform: translateX(-3px);
    }
    20%,
    40%,
    60%,
    80% {
      transform: translateX(3px);
    }
  }
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
// const RefreshIcon = styled.div`
//   background-image: url(${(props) =>
//     props.theme.colorCommon === "black"
//       ? "assets/icons/refreshD.png"
//       : "assets/icons/refreshL.png"});
//   background-repeat: no-repeat;
//   background-size: cover;
//   width: 25px;
//   height: 25px;
// `

const AlertImg = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 9999px;
`

const customStyles = {
  content: {
    top: "55%",
    left: "50%",
    right: "0px",
    bottom: "0px",
    transform: "translate(-50%, -50%)",
    width: "330px",
    height: "700px",
    border: "0px",
    backgroundColor: "rgba(255,255,255,0)",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
}

const ModalCard = tw.div`
  mt-5 p-3 text-black bg-white opacity-90 rounded-3xl shadow-2xl
  inline-flex items-center flex-wrap justify-center
  w-72
`

const ModalBtn = styled.button`
  margin-left: auto;
  margin-right: auto;
  background-color: #0000005c;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 10px;
  color: white;
  font-weight: 200;
`

const AlarmFriendComponent = function ({
  friend,
}: {
  friend: alarmFriendType
}) {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleMove = () => {
    handleDelete()
    navigate("/friend")
  }
  const handleDelete = () => {
    dispatch(DELETE_FRIENDS(friend.fromUser))
  }
  return (
    <ModalCard style={{ fontFamily: "Pretendard", fontWeight: "600" }}>
      <div>
        <AlertImg src={friend.fromProfileImage} alt="defalut" />
      </div>
      <div className="ml-2" style={{ width: "190px" }}>
        <p>
          <span className="text-lilac-600 font-bold">{friend.fromName}</span>
          <span className="text-gray-400">#{friend.fromUser}</span>
          {friend.content}
        </p>
      </div>
      <div className="w-72 mt-4 flex justify-between">
        <ModalBtn onClick={handleMove}>바로가기</ModalBtn>
        <ModalBtn onClick={handleDelete}>알람확인</ModalBtn>
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
  const token = useSelector((state: RootState) => state.auth.accessToken)

  const handleAccept = () => {
    axios({
      method: "PATCH",
      url: process.env.REACT_APP_SERVER_URL + "timecapsule/invite-accept/",
      headers: {
        Authorization: "Bearer " + token,
      },
      data: {
        timecapsuleNo: timecapsule.timecapsuleNo,
      },
    }).then((response) => {
      toast(response.data.message)
      if (response.data.code === 200) {
        navigate("/participate/", { state: { code: timecapsule.code } })
      }
      dispatch(DELETE_TIMECAPSULES(timecapsule.fromUser))
    })
  }
  const handleReject = () => {
    axios({
      method: "PATCH",
      url: process.env.REACT_APP_SERVER_URL + "timecapsule/invite-reject/",
      headers: {
        Authorization: "Bearer " + token,
      },
      data: {
        timecapsuleNo: timecapsule.timecapsuleNo,
      },
    }).then((response) => {
      toast(response.data.message)
      dispatch(DELETE_TIMECAPSULES(timecapsule.fromUser))
    })
  }
  return (
    <ModalCard style={{ fontFamily: "Pretendard", fontWeight: "600" }}>
      <div>
        <AlertImg
          src={"assets/" + timecapsule.fromProfileImage}
          alt="defalut"
        />
      </div>
      <div className="ml-2" style={{ width: "190px" }}>
        <p>
          {timecapsule.content}
          <span>{timecapsule.code}</span>
        </p>
      </div>
      <div className="w-72 mt-4 flex justify-between">
        <ModalBtn onClick={handleAccept}>수락하기</ModalBtn>
        <ModalBtn onClick={handleReject}>거절하기</ModalBtn>
      </div>
    </ModalCard>
  )
}

const AlarmOpenTimecapsuleComponent = function ({
  timecapsule,
}: {
  timecapsule: alarmOpenCapsuleType
}) {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleMove = () => {
    handleDelete()
    navigate(`/timecapsule/open/${timecapsule.timecapsuleNo}`)
  }

  const handleDelete = () => {
    dispatch(DELETE_OPENTIMECAPSULES(timecapsule.timecapsuleNo))
  }
  return (
    <ModalCard style={{ fontFamily: "Pretendard", fontWeight: "600" }}>
      <div>
        <AlertImg src="assets/universe/universe_popup.png" alt="defalut" />
      </div>
      <div className="ml-2" style={{ width: "190px" }}>
        <p>
          {timecapsule.content}
          <span>{timecapsule.title}</span>
        </p>
      </div>
      <div className="w-72 mt-4 flex justify-between">
        <ModalBtn onClick={handleMove}>바로가기</ModalBtn>
        <ModalBtn onClick={handleDelete}>알람확인</ModalBtn>
      </div>
    </ModalCard>
  )
}

export const MainHeader = function () {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [modalOpen, setModalOpen] = useState(false)
  const alarmFriendData = useSelector((state: RootState) => state.alarm.friends)
  const alarmTimecapsuleData = useSelector(
    (state: RootState) => state.alarm.timecapsules
  )
  const alarmOpenTimecapsuleData = useSelector(
    (state: RootState) => state.alarm.openCapsules
  )

  const handleClose = () => {
    setModalOpen(false)
  }

  const handleErase = () => {
    dispatch(DELETE_ALARM_ALL())
  }

  return (
    <div>
      <Modal
        isOpen={modalOpen}
        onRequestClose={handleClose}
        style={customStyles}
      >
        <div className="flex justify-between">
          <button onClick={handleErase} className="flex items-center">
            <img src="assets/icons/bin.png" alt="erase" width="18px" />
            <span className="text-white ml-1 font-pretendard font-extralight text-sm">
              전체 삭제
            </span>
          </button>
          <button onClick={handleClose}>
            <img src="assets/icons/cancel.png" alt="cancel" />
          </button>
        </div>
        <div>
          {alarmFriendData.length === 0 &&
            alarmTimecapsuleData.length === 0 &&
            alarmOpenTimecapsuleData.length === 0 && (
              <ModalCard
                style={{ fontFamily: "Pretendard", fontWeight: "600" }}
              >
                <div>
                  <AlertImg src="assets/icons/popup.png" alt="defalut" />
                </div>
                <div className="ml-2" style={{ width: "190px" }}>
                  <p>받은 알림이 없습니다.</p>
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
                  key={timecapsule.fromUser}
                  timecapsule={timecapsule}
                />
              ))}
            </div>
          )}
          {alarmOpenTimecapsuleData.length !== 0 && (
            <div>
              {alarmOpenTimecapsuleData.map(
                (timecapsule: alarmOpenCapsuleType) => (
                  <AlarmOpenTimecapsuleComponent
                    key={timecapsule.title}
                    timecapsule={timecapsule}
                  />
                )
              )}
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
          {alarmFriendData.length +
            alarmOpenTimecapsuleData.length +
            alarmTimecapsuleData.length !==
            0 && (
            <div className="relative w-6 -top-4 left-9 px-1 text-white bg-red-400 rounded-full text-center">
              {alarmFriendData.length +
                alarmOpenTimecapsuleData.length +
                alarmTimecapsuleData.length}
            </div>
          )}
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
