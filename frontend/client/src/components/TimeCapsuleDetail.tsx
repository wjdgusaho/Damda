import React, { useEffect, useMemo, useState } from "react"
import "../index.css"
import { styled } from "styled-components"
import { useNavigate, useParams } from "react-router"
import { SubHeader } from "./inc/SubHeader"
import axios from "axios"
import { serverUrl } from "../urls"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "../store/Store"
import "./datePicker.css"
import Modal from "react-modal"
import { DELETE_DETAIL, SET_DETAIL } from "../store/Timecapsule"

export interface DataType {
  timecapsuleNo: number
  capsuleType: string
  registDate: string
  openDate: string
  title: string
  description: string
  capsuleIcon: string
  goalCard: number
  nowCard: number
  inviteCode: string
  maxParticipant: number
  nowParticipant: number
  penalty: {
    penaltyNo: number
    penalty: boolean
    penaltyDescription: string
  }
  criteriaInfo: {
    criteriaId: number
    criteriaType: string
    weatherStatus: string
    startTime: string
    endTime: string
    localBig: string
    localMedium: string
    timeKr: string
    cirteriaDays: {
      dayKr: string
      dayEn: string
    }[]
  }
  myInfo: {
    userNo: number
    cardAble: boolean
    fileAble: boolean
    host: boolean
  }
  partInfo: {
    userNo: number
    nickname: string
    profileImage: string
  }[]
}

interface FriendDataType {
  userNo: number
  profileImage: string
  nickname: string
  status: string
}

interface FriendListDataType {
  data: FriendDataType[]
}

declare global {
  interface Window {
    Kakao: any
  }
  const Kakao: any
}

const calculateDday = (endDate: string) => {
  const currentDate = new Date()
  const dateString = currentDate.toISOString().slice(0, 10)
  const endDateString = endDate.toString().slice(0, 10)
  const dday = calculateDateDifference(dateString, endDateString)

  let ddayPrint = ""
  if (dday <= 0) {
    ddayPrint = "D - DAY"
  } else {
    ddayPrint = "D - " + dday
  }
  return ddayPrint
}

const calculateDateDifference = (startDate: string, endDate: string) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const differenceInTime = end.getTime() - start.getTime()
  const differenceInDays = differenceInTime / (1000 * 3600 * 24)
  return differenceInDays
}

const Background = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`

const Box = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  justify-content: start;
  align-items: center;
  margin: auto;
  width: 20rem;
  background-color: ${(props) => props.theme.color50};
  border-radius: 50px;
  font-family: "Pretendard";
  margin-top: 150px;
  box-shadow: 0px 4px 4px 4px rgb(0, 0, 0, 0.25);
  color: ${(props) => props.theme.color900};
  min-height: 34rem;
  padding: 0px 15px;
`

const Title = styled.div`
  z-index: 1;
  position: absolute;
  top: 144px;
`

const HightLight = styled.div`
  position: absolute;
  width: calc(100% + 10px);
  height: 13px;
  background-color: ${(props) => props.theme.color200};
  top: 15px;
  margin-left: -5px;
`

const CapsuleImg = styled.div<{ capsuleIcon: string }>`
  position: absolute;
  top: -102px;
  background-image: url(/${(props) => props.theme[props.capsuleIcon]});
  background-repeat: no-repeat;
  background-size: cover;
  width: 204px;
  height: 204px;
  filter: drop-shadow(0px 4px 4px rgb(0, 0, 0, 0.4));
`

const CapsuleGray = styled(CapsuleImg)`
  filter: drop-shadow(0px 4px 4px rgb(0, 0, 0, 0.4)) grayscale(100%);
`

const ExitImg = styled.img`
  position: absolute;
  top: 30px;
  right: 25px;
  filter: drop-shadow(0px 4px 4px rgb(0, 0, 0, 0.4));
`

const HelpIcon = styled.img`
  position: absolute;
  top: -90px;
  right: 0;
  width: 30px;
  height: 30px;
`

const TimerWrap = styled.div`
  position: absolute;
  color: #fff;
  font-size: 36px;
  top: -32px;
  font-weight: 700;
  filter: drop-shadow(4px 4px 4px rgb(0, 0, 0));
  text-align: center;
  div {
    font-size: 15px;
    font-weight: 300;
  }
`

const CardBtn = styled.button`
  width: 270px;
  height: 54px;
  border-radius: 30px;
  background-color: ${(props) => props.theme.color200};
  color: ${(props) => props.theme.color950};
  font-size: 24px;
  box-shadow: 0px 4px 4px rgb(0, 0, 0, 0.5);
`

const CardCompleteBtn = styled(CardBtn)`
  background-color: #aeaeae;
  color: #fff;
`

const BackBtn = styled.div`
  color: ${(props) => props.theme.color950};
  font-size: 16px;
  /* position: absolute; */
  /* bottom: 0; */
`

const FileIcon = styled.img`
  width: 18px;
  height: 18px;
  margin-top: 2px;
  margin-right: 5px;
`

const FileIcon2 = styled(FileIcon)`
  margin-top: 0;
`

const InviteBtn = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.color200};
  box-shadow: 0px 4px 4px rgb(0, 0, 0, 0.25);
  font-size: 50px;
  font-weight: 200;
  text-align: center;
  line-height: 38px;
  margin-top: 8px;
`

const FriendBox = styled.div`
  width: 17rem;
  background-color: ${(props) => props.theme.color100};
  border-radius: 50px;
  padding: 30px 20px;
  height: 300px;
  overflow: scroll;
`

const FileInputBox = styled.div`
  background-color: rgb(0, 0, 0, 0.15);
  width: 194px;
  height: 26px;
  border-radius: 10px;
`

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    borderRadius: "20px",
    fontFamily: "Pretendard",
  },
  overlay: {
    zIndex: 2,
    backgroundColor: "rgba(0, 0, 0, 0.733)",
  },
}

const ModalContent = styled.div`
  color: ${(props) => props.theme.color900};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 13px;
`

const ModalTitle = styled.div`
  font-size: 20px;
  font-weight: 700;

  span {
    color: ${(props) => props.theme.color500};
  }
`

// 취소 등록 버튼
const FileCencelBtn = styled.button`
  width: 76px;
  height: 25px;
  border-radius: 30px;
  background-color: rgb(255, 255, 255, 0.05);
  color: ${(props) => props.theme.color900};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  font-size: 16px;
  font-weight: 500;
  margin: 10px 13px;
`

const FileSubmitBtn = styled(FileCencelBtn)`
  background-color: ${(props) => props.theme.color500};
`

const InviteRequestBtn = styled.button`
  width: 67px;
  height: 28px;
  border-radius: 30px;
  background-color: ${(props) => props.theme.color200};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.3);
`

const InvitedBtn = styled(InviteRequestBtn)`
  background-color: #cfcfcf;
`

const Shareimg = styled.img`
  right: -25px;
  top: 5px;
  width: 16px;
  height: 20px;
`

const TimeCapsuleDetail = function () {
  const { capsuleId } = useParams()
  const token = useSelector((state: RootState) => state.auth.accessToken)
  const capsuleData = useSelector(
    (state: RootState) => state.timecapsule.timecapsuleDetail
  )
  const dispatch = useDispatch()

  //카카오 javaScript 생성
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://developers.kakao.com/sdk/js/kakao.js"
    script.async = true

    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios({
          method: "GET",
          url: serverUrl + `timecapsule/detail?timecapsuleNo=${capsuleId}`,
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        })
        dispatch(SET_DETAIL(response.data.data.timecapsule))
      } catch (error) {
        console.log("Error fetching data:", error)
      }
    }

    fetchData()
    return () => {
      dispatch(DELETE_DETAIL())
    }
  }, [capsuleId, token])

  console.log(capsuleData)

  const currentDate = new Date()
  const oneDayLater = new Date(capsuleData.registDate)
  oneDayLater.setHours(oneDayLater.getHours() + 24).toString()

  const isRegistered = currentDate < oneDayLater

  return (
    <>
      {isRegistered ? (
        // 24시간이 안 지났을 때 (미등록 타임캡슐)
        <Unregistered capsuleData={capsuleData} />
      ) : (
        // 24시간이 지났을 때 (등록 완료된 타임캡슐)
        <Proceeding capsuleData={capsuleData} />
      )}
    </>
  )
}

interface CapsuleProps {
  capsuleData: DataType
}

interface FileDataType {
  maxFileSize: number
  nowFilesize: number
}

export const Unregistered: React.FC<CapsuleProps> = ({ capsuleData }) => {
  const endDateString = capsuleData.openDate
    ? capsuleData.openDate.toString().slice(0, 10)
    : ""
  const isHost = capsuleData.myInfo.host
  const isCardAble = capsuleData.myInfo.cardAble
  const [isFileAble, setIsFileAble] = useState(capsuleData.myInfo.fileAble)
  const [nowParticipant, setNowParticipant] = useState(
    capsuleData.nowParticipant
  )

  const navigate = useNavigate()
  const oneDayLater = useMemo(() => {
    const date = new Date(capsuleData.registDate)
    date.setHours(date.getHours() + 24)
    return date
  }, [capsuleData.registDate])
  const [timer, setTimer] = useState<string>("")
  const [isInvite, setIsInvite] = useState(true)
  const [isHelp, setIsHelp] = useState(false)

  const [modalIsOpen, setIsOpen] = React.useState(false)
  const [deleteModalIsOpen, setDeleteModalIsOpen] = React.useState(false)
  const [kickOutModalIsOpen, setKickOutModalIsOpen] = React.useState(false)
  const [exitModalIsOpen, setExitModalIsOpen] = React.useState(false)

  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const { capsuleId = "" } = useParams()
  const token = useSelector((state: RootState) => state.auth.accessToken)
  const [fileSizeData, setFileSizeData] = useState<FileDataType | null>(null)
  const [friendList, setFriendList] = useState<FriendListDataType | undefined>()
  const [kickOutedUserNo, setKickOutedUserNo] = useState<number>(0)
  const [kickOutedUserNickname, setKickOutedUserNickname] = useState<string>()

  const kickOutUser = async (userNo: number) => {
    try {
      const response = await axios({
        method: "PATCH",
        url: serverUrl + "timecapsule/kick",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        data: {
          timecapsuleNo: capsuleId + "",
          kickUserNo: userNo + "",
        },
      })
      if (response.data.code === 200) {
        closeKickOutModal()
        window.location.reload()
        console.log(response.data)
      } // 나중에 추가할거임
    } catch (error) {
      console.log(error)
    }
  }

  const inviteFriendClick = async (userNo: number) => {
    try {
      const response = await axios({
        method: "PATCH",
        url: serverUrl + "timecapsule/invite",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        data: {
          timecapsuleNo: capsuleId,
          friendNo: userNo,
        },
      })
      if (response.data.code === 200) {
        getFriendList()
      } else if (response.data.code === -6006) {
        alert("없는 유저 입니다.")
      } else if (response.data.code === -6002) {
        alert("존재하지 않는 타임캡슐 입니다.")
      } else if (response.data.code === -3010) {
        alert("이미 초대된 회원입니다.")
      } else if (response.data.code === -3014) {
        alert("해당 유저는 이미 참여 중입니다.")
      } else if (response.data.code === -3015) {
        alert("이미 강퇴 당했거나 나간 유저입니다.")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleDeleteClick = async () => {
    try {
      const response = await axios({
        method: "PATCH",
        url: serverUrl + "timecapsule/delete",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        data: {
          timecapsuleNo: capsuleId,
        },
      })
      if (response.data.code === 200) {
        navigate("/main")
      } else if (response.data.code === -6006) {
        alert("존재하지 않는 유저입니다.")
      } else if (response.data.code === -6002) {
        alert("존재하지 않는 타임캡슐 입니다.")
      } else if (response.data.code === -6008) {
        alert("이미 삭제된 타임캡슐 입니다.")
      } else if (response.data.code === -5008) {
        alert("해당 유저의 타임캡슐이 아닙니다.")
      } else if (response.data.code === -3007) {
        alert("해당 타임캡슐의 방장이 아닙니다.")
      } else if (response.data.code === -3009) {
        alert("생성 후 24시간 이내에만 삭제할 수 있습니다.")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleExitClick = async () => {
    try {
      const response = await axios({
        method: "PATCH",
        url: serverUrl + "timecapsule/exit",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        data: {
          timecapsuleNo: capsuleId,
        },
      })
      if (response.data.code === 200) {
        navigate("/main")
      } else if (response.data.code === -6006) {
        alert("존재하지 않는 유저입니다.")
      } else if (response.data.code === -6002) {
        alert("존재하지 않는 타임캡슐 입니다.")
      } else if (response.data.code === -6008) {
        alert("이미 삭제된 타임캡슐 입니다.")
      } else if (response.data.code === -5008) {
        alert("해당 유저의 타임캡슐이 아닙니다.")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getFileSize = async () => {
    try {
      const response = await axios({
        method: "GET",
        url: serverUrl + `timecapsule/size?timecapsuleNo=${capsuleId}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      setFileSizeData(response.data.data)
    } catch (error) {
      console.log("Error fetching data:", error)
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0]

    if (fileSizeData && file) {
      const remainingSpace =
        (fileSizeData.maxFileSize || 0) - (fileSizeData.nowFilesize || 0)
      const fileSize = file.size / (1024 * 1024) // MB 단위로 변환

      if (fileSize <= remainingSpace) {
        setSelectedFile(file.name)
        setUploadedFile(file)
      } else {
        alert("파일 크기가 사용 가능한 공간을 초과합니다.")
      }
    } else {
      setSelectedFile(null)
    }
  }

  const handleFileSubmit = async () => {
    if (uploadedFile) {
      const formData = new FormData()
      formData.append("fileContent", uploadedFile)
      try {
        formData.append("timeCapsuleNo", capsuleId.toString())

        const response = await axios({
          method: "POST",
          url: serverUrl + "timecapsule/regist/file",
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + token,
          },
          data: formData,
        })
        console.log(response.data)
        setIsFileAble(false)
        closeModal()
      } catch (error) {
        console.log(error)
      }
    }
  }

  const getFriendList = async () => {
    try {
      const response = await axios({
        method: "GET",
        url: serverUrl + `timecapsule/invite?timecapsuleNo=${capsuleId}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      setFriendList(response.data)
      console.log(response.data)
    } catch (error) {
      console.log("Error fetching data:", error)
    }
  }

  function openModal() {
    setIsOpen(true)
    getFileSize()
  }

  function closeModal() {
    setIsOpen(false)
  }

  function openDeleteModal() {
    setDeleteModalIsOpen(true)
  }

  function closeDeleteModal() {
    setDeleteModalIsOpen(false)
  }

  function openExitModal() {
    setExitModalIsOpen(true)
  }

  function closeExitModal() {
    setExitModalIsOpen(false)
  }

  function openKickOutModal(userNo: number, userNickname: string) {
    setKickOutModalIsOpen(true)
    setKickOutedUserNo(userNo)
    setKickOutedUserNickname(userNickname)
  }

  function closeKickOutModal() {
    setKickOutModalIsOpen(false)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date()
      const timeDiffer = oneDayLater.getTime() - currentTime.getTime()
      if (timeDiffer <= 0) {
        clearInterval(interval)
        alert("타임캡슐 등록완료") // 이거 나중에 바꾸기
      } else {
        const hours = Math.floor(timeDiffer / (1000 * 60 * 60))
        const minutes = Math.floor(
          (timeDiffer % (1000 * 60 * 60)) / (1000 * 60)
        )
        const seconds = Math.floor((timeDiffer % (1000 * 60)) / 1000)

        const formattedHours = hours.toString().padStart(2, "0")
        const formattedMinutes = minutes.toString().padStart(2, "0")
        const formattedSeconds = seconds.toString().padStart(2, "0")
        setTimer(`${formattedHours}:${formattedMinutes}:${formattedSeconds}`)
      }
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [oneDayLater])

  //랜덤 숫자 생성
  const generateRandomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  function kakaoShare() {
    console.log("Kakao : ", window.Kakao)
    if (window.Kakao) {
      const kakao = window.Kakao

      // 중복 initialization 방지
      if (!kakao.isInitialized()) {
        kakao.init("e25afc7dead08f60a151179a01026248")
      }

      const imageUrls = [
        "https://damda.s3.ap-northeast-2.amazonaws.com/%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C/Frame+45.png",
        "https://damda.s3.ap-northeast-2.amazonaws.com/%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C/Frame+48.png",
        "https://damda.s3.ap-northeast-2.amazonaws.com/%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C/Frame+49.png",
      ]

      const randomNum = generateRandomNumber(0, 3)

      kakao.Link.sendDefault({
        objectType: "feed",
        content: {
          title: "당신의 스쳐가는 시간을 의미있게 담다",
          description:
            "친구가 담다에서 기다리고있어요\n메인화면에서 캡슐코드를 입력해주세요.",
          imageUrl: imageUrls[randomNum],
          link: {
            mobileWebUrl: "https://damda.online",
            webUrl: "https://damda.online",
          },
        },
        itemContent: {
          items: [
            {
              item: "캡슐코드",
              itemOp: `${capsuleData.inviteCode}`,
            },
          ],
        },
        buttons: [
          {
            title: "담다 접속하기",
            link: {
              mobileWebUrl: "https://damda.online",
              webUrl: "https://damda.online",
            },
          },
        ],
      })
    }
  }

  return (
    <div className="relative">
      {isHelp && capsuleData.myInfo.host ? (
        <HelpHost isHelp={isHelp} setIsHelp={setIsHelp} />
      ) : null}

      {isHelp && capsuleData.myInfo.host === false ? (
        <HelpGuest isHelp={isHelp} setIsHelp={setIsHelp} />
      ) : null}

      <Background className={isHelp ? "blur-sm" : ""}>
        <SubHeader />
        <Box>
          <HelpIcon
            onClick={() => setIsHelp(!isHelp)}
            src="../../assets/icons/questionMark.png"
            alt="questionMark"
          />
          <CapsuleGray capsuleIcon={capsuleData.capsuleIcon} />
          {isHost ? (
            <ExitImg
              onClick={openDeleteModal}
              src="../../assets/icons/bin_dark.png"
              alt="bin"
            />
          ) : (
            <ExitImg
              onClick={openExitModal}
              src="../../assets/icons/exit.png"
              alt="exit"
              width="22.5px"
              height="22.5px"
            />
          )}

          <Modal
            isOpen={deleteModalIsOpen}
            onRequestClose={closeDeleteModal}
            style={customStyles}
            contentLabel="DeleteModal"
          >
            <ModalContent>
              <ModalTitle className="my-2">정말 삭제하시겠어요?</ModalTitle>
              <div>삭제하면 타임캡슐이 사라져요.</div>
              <div className="mt-2">
                <FileCencelBtn type="button" onClick={closeDeleteModal}>
                  취소
                </FileCencelBtn>
                <FileSubmitBtn onClick={handleDeleteClick}>삭제</FileSubmitBtn>
              </div>
            </ModalContent>
          </Modal>

          <Modal
            isOpen={exitModalIsOpen}
            onRequestClose={closeExitModal}
            style={customStyles}
            contentLabel="ExitModal"
          >
            <ModalContent>
              <ModalTitle className="my-2">정말 나가시겠어요?</ModalTitle>
              <div>한 번 나가면 다시 들어올 수 없어요.</div>
              <div className="mt-2">
                <FileCencelBtn type="button" onClick={closeExitModal}>
                  취소
                </FileCencelBtn>
                <FileSubmitBtn onClick={handleExitClick}>나가기</FileSubmitBtn>
              </div>
            </ModalContent>
          </Modal>

          <TimerWrap>
            {timer}
            <div className="-mt-1">뒤에 등록돼요</div>
          </TimerWrap>

          {isInvite ? (
            <>
              {capsuleData.capsuleType === "GOAL" ? (
                <div className="text-2xl font-bold mt-28">
                  {capsuleData.nowCard} / {capsuleData.goalCard}
                </div>
              ) : (
                <div className="text-2xl font-bold mt-28">
                  {calculateDday(capsuleData.openDate)}
                </div>
              )}
              <Title className="text-2xl font-bold relative mb-1">
                {capsuleData.title}
              </Title>
              <div className="text-2xl font-bold relative mb-1">
                <HightLight />
                <div className="invisible">{capsuleData.title}</div>
              </div>
              <div style={{ fontSize: "14px", textAlign: "center" }}>
                {capsuleData.description}
              </div>
              {capsuleData.capsuleType !== "CLASSIC" ? (
                <div className="text-center mt-3">
                  타임캡슐이 등록되고 나면 <br />
                  매일 1장의 카드와 파일을 업로드 할 수 있어요
                </div>
              ) : null}

              {capsuleData.criteriaInfo.cirteriaDays ? (
                <div className="text-center mt-3">
                  매주{" "}
                  {capsuleData.criteriaInfo.cirteriaDays?.map((day) => (
                    <span key={day.dayEn} className="font-bold">
                      {day.dayKr}{" "}
                    </span>
                  ))}{" "}
                  기록해요
                </div>
              ) : null}

              {capsuleData.criteriaInfo.weatherStatus ||
              capsuleData.criteriaInfo.localBig ? (
                <div className="mt-3 text-center">
                  {capsuleData.criteriaInfo.weatherStatus ? (
                    <div>
                      <span className="font-bold">
                        {capsuleData.criteriaInfo.weatherStatus === "RAIN"
                          ? "비"
                          : capsuleData.criteriaInfo.weatherStatus === "SNOW"
                          ? "눈"
                          : null}{" "}
                        <span className="font-normal">오는 날</span>
                      </span>
                    </div>
                  ) : null}
                  {capsuleData.criteriaInfo.localBig ? (
                    <div>
                      <span className="font-bold">
                        {capsuleData.criteriaInfo.localBig}{" "}
                        {capsuleData.criteriaInfo.localMedium}{" "}
                        <span className="font-normal">에서</span>
                      </span>{" "}
                    </div>
                  ) : null}
                  열 수 있어요.
                </div>
              ) : null}

              {capsuleData.penalty ? (
                <div className="text-center mt-3">
                  카드를 가장 적게 작성한 친구는 <br />{" "}
                  <span className="font-bold">
                    {capsuleData.penalty.penaltyDescription}
                  </span>{" "}
                  벌칙을 받아요
                </div>
              ) : null}

              {capsuleData.capsuleType === "GOAL" ? (
                <div className="my-3 text-center">
                  <div>작성한 내용은</div>총{" "}
                  <span className="font-bold">{capsuleData.goalCard}장</span>의
                  카드가 채워지면 공개됩니다
                </div>
              ) : (
                <div className="my-3 text-center">
                  <div>작성한 내용은</div>
                  <span className="font-bold">
                    {endDateString} {capsuleData.criteriaInfo.timeKr}
                  </span>{" "}
                  에 공개됩니다
                </div>
              )}
              <div>
                {isHost ? (
                  <div className="flex justify-center flex-wrap w-80">
                    {capsuleData.partInfo.map((part, idx) => (
                      <div key={part.userNo} className="flex flex-col">
                        {idx === 0 ? (
                          <>
                            <div className="relative">
                              <img
                                style={{
                                  backgroundColor: "#fff",
                                  borderRadius: "50%",
                                  width: "44px",
                                  height: "44px",
                                  boxShadow: "0px 4px 4px rgb(0, 0, 0, 0.25)",
                                  margin: "8px",
                                }}
                                src={part.profileImage}
                                alt="profilepic"
                              />
                              <img
                                src="../../assets/icons/crown.png"
                                alt="crown"
                                width="27px"
                                height="22px"
                                style={{
                                  position: "absolute",
                                  top: "-7px",
                                  left: "16px",
                                }}
                              />
                            </div>
                            <span
                              style={{
                                fontSize: "12px",
                                textAlign: "center",
                                width: "63px",
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {part.nickname}
                            </span>
                          </>
                        ) : (
                          <>
                            <div className="relative">
                              <img
                                style={{
                                  backgroundColor: "#fff",
                                  borderRadius: "50%",
                                  width: "44px",
                                  height: "44px",
                                  boxShadow: "0px 4px 4px rgb(0, 0, 0, 0.25)",
                                  margin: "8px",
                                }}
                                src={part.profileImage}
                                alt="profilepic"
                              />
                              {/* 강퇴하기 */}
                              <img
                                onClick={() =>
                                  openKickOutModal(part.userNo, part.nickname)
                                }
                                src="../../assets/icons/kickout.png"
                                alt="kickout"
                                width="15px"
                                height="15px"
                                style={{
                                  position: "absolute",
                                  top: "7.5px",
                                  right: "5px",
                                  filter:
                                    "drop-shadow(0px 4px 4px rgb(0, 0, 0, 0.4))",
                                }}
                              />
                            </div>
                            <span
                              style={{
                                fontSize: "12px",
                                textAlign: "center",
                                width: "63px",
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {part.nickname}
                            </span>
                          </>
                        )}
                      </div>
                    ))}
                    {nowParticipant < 10 ? (
                      <InviteBtn
                        onClick={() => {
                          setIsInvite(false)
                          getFriendList()
                        }}
                      >
                        +
                      </InviteBtn>
                    ) : null}
                  </div>
                ) : (
                  <div className="flex justify-center flex-wrap w-80">
                    {capsuleData.partInfo.map((part, idx) => (
                      <div key={part.userNo} className="flex flex-col">
                        {idx === 0 ? (
                          <>
                            <div className="relative">
                              <img
                                style={{
                                  backgroundColor: "#fff",
                                  borderRadius: "50%",
                                  width: "44px",
                                  height: "44px",
                                  boxShadow: "0px 4px 4px rgb(0, 0, 0, 0.25)",
                                  margin: "8px",
                                }}
                                src={part.profileImage}
                                alt="profilepic"
                              />
                              <img
                                src="../../assets/icons/crown.png"
                                alt="crown"
                                width="27px"
                                height="22px"
                                style={{
                                  position: "absolute",
                                  top: "-7px",
                                  left: "16px",
                                }}
                              />
                            </div>
                            <span
                              style={{
                                fontSize: "12px",
                                textAlign: "center",
                                width: "63px",
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {part.nickname}
                            </span>
                          </>
                        ) : (
                          <>
                            <div className="relative">
                              <img
                                style={{
                                  backgroundColor: "#fff",
                                  borderRadius: "50%",
                                  width: "44px",
                                  height: "44px",
                                  boxShadow: "0px 4px 4px rgb(0, 0, 0, 0.25)",
                                  margin: "8px",
                                }}
                                src={part.profileImage}
                                alt="profilepic"
                              />
                            </div>
                            <span
                              style={{
                                fontSize: "12px",
                                textAlign: "center",
                                width: "63px",
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {part.nickname}
                            </span>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {/* 여기 일단 임시로 null (방장 아닐 때) */}
              </div>

              <Modal
                isOpen={kickOutModalIsOpen}
                onRequestClose={closeKickOutModal}
                style={customStyles}
                contentLabel="KickOutModal"
              >
                <ModalContent>
                  <ModalTitle className="my-2 text-center">
                    정말 <span>{kickOutedUserNickname}</span>
                    님을 <br />
                    추방하시겠습니까?
                  </ModalTitle>
                  <div>한 번 추방하면 다시 들어올 수 없습니다.</div>
                  <div className="mt-2">
                    <FileCencelBtn type="button" onClick={closeKickOutModal}>
                      취소
                    </FileCencelBtn>
                    <FileSubmitBtn onClick={() => kickOutUser(kickOutedUserNo)}>
                      추방
                    </FileSubmitBtn>
                  </div>
                </ModalContent>
              </Modal>

              <>
                <div className="flex w-56 my-2 mt-5">
                  {isFileAble ? (
                    <>
                      <FileIcon
                        src="../../assets/icons/file.png"
                        alt="fileicon"
                      />
                      <span onClick={openModal}>파일 첨부하기</span>
                    </>
                  ) : (
                    <>
                      <FileIcon
                        src="../../assets/icons/file.png"
                        alt="fileicon"
                      />
                      <span>파일 첨부 완료</span>
                    </>
                  )}

                  <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel="Example Modal"
                  >
                    <ModalContent>
                      <ModalTitle className="mb-2">
                        파일을 선택해주세요
                      </ModalTitle>
                      <div className="flex items-center">
                        타임캡슐의 남은 용량 :{" "}
                        {fileSizeData?.maxFileSize !== undefined &&
                        fileSizeData?.nowFilesize !== undefined
                          ? Math.floor(
                              (fileSizeData?.maxFileSize -
                                fileSizeData?.nowFilesize) /
                                (1024 * 1024)
                            )
                          : "0"}
                        MB
                        <img
                          className="ml-2"
                          src="../../assets/icons/volumeUp.png"
                          alt="volumeUp"
                          width="54px"
                          onClick={() => {
                            navigate("/shop")
                          }}
                        />
                      </div>
                      <input
                        style={{ display: "none" }}
                        type="file"
                        name="file"
                        id="file"
                        accept="audio/*, video/*"
                        onChange={handleFileChange}
                      />
                      {selectedFile === null ? (
                        <FileInputBox className="flex my-4 items-center pl-3">
                          <FileIcon2
                            src="../../assets/icons/file.png"
                            alt="fileicon"
                          />
                          <label htmlFor="file">파일을 선택하세요</label>
                        </FileInputBox>
                      ) : (
                        <FileInputBox className="flex my-4 items-center pl-3">
                          <FileIcon2
                            src="../../assets/icons/file.png"
                            alt="fileicon"
                          />
                          <label htmlFor="file">{selectedFile}</label>
                        </FileInputBox>
                      )}
                      <div style={{ textAlign: "center" }}>
                        등록 후에는 삭제 및 변경할 수 없어요. <br />
                        등록하시겠어요?
                      </div>
                      <div>
                        <FileCencelBtn type="button" onClick={closeModal}>
                          취소
                        </FileCencelBtn>
                        <FileSubmitBtn onClick={handleFileSubmit}>
                          등록
                        </FileSubmitBtn>
                      </div>
                    </ModalContent>
                  </Modal>
                </div>
                {isCardAble ? (
                  <CardBtn
                    onClick={() => {
                      navigate(`/card/${capsuleId}`)
                    }}
                  >
                    카드 작성하기
                  </CardBtn>
                ) : (
                  <CardCompleteBtn>카드 작성완료</CardCompleteBtn>
                )}
              </>

              <BackBtn
                onClick={() => {
                  navigate(-1)
                }}
                className="my-5"
              >
                돌아가기
              </BackBtn>
            </>
          ) : (
            <>
              <div
                className="text-2xl font-normal mt-28"
                style={{ fontSize: "14px" }}
              >
                참여코드
              </div>
              <Title className="text-2xl font-bold relative mb-1">
                {capsuleData.inviteCode}
              </Title>
              <div className="text-2xl font-bold relative mb-1">
                <div>{capsuleData.inviteCode}</div>
                <HightLight />
                {/* 공유하기 버튼 */}
                <Shareimg
                  onClick={kakaoShare}
                  className="absolute"
                  src="../../assets/icons/share.png"
                  alt="share"
                />
              </div>
              <FriendBox className="flex flex-col mt-2">
                <div style={{ fontSize: "13px" }}>친구 목록</div>
                {friendList?.data &&
                  friendList.data.map((friend, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <img
                            style={{
                              backgroundColor: "#fff",
                              borderRadius: "50%",
                              width: "44px",
                              height: "44px",
                              boxShadow: "0px 4px 4px rgb(0, 0, 0, 0.25)",
                              margin: "8px",
                              objectFit: "cover",
                            }}
                            src={friend.profileImage}
                            alt="profilepic"
                          />
                          <div
                            className="flex flex-col"
                            style={{ fontWeight: "500", marginLeft: "4px" }}
                          >
                            {friend.nickname}
                            <span
                              style={{
                                fontSize: "13px",
                                opacity: "70%",
                                fontWeight: "300",
                              }}
                            >
                              #{friend.userNo}
                            </span>
                          </div>
                        </div>
                        {friend.status === "" ||
                        friend.status === "REJECTED" ? (
                          <InviteRequestBtn
                            onClick={() => inviteFriendClick(friend.userNo)}
                          >
                            초대
                          </InviteRequestBtn>
                        ) : friend.status === "NOTREAD" ? (
                          <InvitedBtn>요청됨</InvitedBtn>
                        ) : friend.status === "ACCEPTED" ? (
                          <InvitedBtn>참여중</InvitedBtn>
                        ) : null}
                      </div>
                    </div>
                  ))}
              </FriendBox>
              <BackBtn
                onClick={() => {
                  setIsInvite(true)
                }}
                className="my-5"
              >
                돌아가기
              </BackBtn>
            </>
          )}
          {/* 임시로 일단 이렇게 */}
        </Box>
        <div className="h-9"></div>
      </Background>
    </div>
  )
}

export const Proceeding: React.FC<CapsuleProps> = ({ capsuleData }) => {
  const endDateString = capsuleData.openDate
    ? capsuleData.openDate.toString().slice(0, 10)
    : ""
  const navigate = useNavigate()
  const isCardAble = capsuleData.myInfo.cardAble
  const [isFileAble, setIsFileAble] = useState(capsuleData.myInfo.fileAble)
  const [modalIsOpen, setIsOpen] = React.useState(false)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)

  const { capsuleId = "" } = useParams()
  const token = useSelector((state: RootState) => state.auth.accessToken)
  const [fileSizeData, setFileSizeData] = useState<FileDataType | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  console.log(capsuleData.myInfo.fileAble)
  console.log(isFileAble)

  const getFileSize = async () => {
    try {
      const response = await axios({
        method: "GET",
        url: serverUrl + `timecapsule/size?timecapsuleNo=${capsuleId}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      setFileSizeData(response.data.data)
    } catch (error) {
      console.log("Error fetching data:", error)
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0]

    if (fileSizeData && file) {
      const remainingSpace =
        (fileSizeData.maxFileSize || 0) - (fileSizeData.nowFilesize || 0)
      const fileSize = file.size / (1024 * 1024) // MB 단위로 변환

      if (fileSize <= remainingSpace) {
        setSelectedFile(file.name)
        setUploadedFile(file)
      } else {
        alert("파일 크기가 사용 가능한 공간을 초과합니다.")
      }
    } else {
      setSelectedFile(null)
    }
  }

  const handleFileSubmit = async () => {
    if (uploadedFile) {
      const formData = new FormData()
      formData.append("fileContent", uploadedFile)
      try {
        formData.append("timeCapsuleNo", capsuleId.toString())

        const response = await axios({
          method: "POST",
          url: serverUrl + "timecapsule/regist/file",
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + token,
          },
          data: formData,
        })
        console.log(response.data)
        setIsFileAble(false)
        closeModal()
      } catch (error) {
        console.log(error)
      }
    }
  }

  function openModal() {
    setIsOpen(true)
    getFileSize()
  }

  function closeModal() {
    setIsOpen(false)
  }

  useEffect(() => {
    setIsFileAble(capsuleData.myInfo.fileAble)
  }, [capsuleData])

  return (
    <>
      <SubHeader />
      <Box>
        <CapsuleImg capsuleIcon={capsuleData.capsuleIcon} />
        <>
          {capsuleData.capsuleType === "GOAL" ? (
            <div className="text-2xl font-bold mt-28">
              {capsuleData.nowCard} / {capsuleData.goalCard}
            </div>
          ) : (
            <div className="text-2xl font-bold mt-28">
              {calculateDday(capsuleData.openDate)}
            </div>
          )}
          <Title className="text-2xl font-bold relative mb-1">
            {capsuleData.title}
          </Title>
          <div className="text-2xl font-bold relative mb-1">
            <div className="invisible">{capsuleData.title}</div>
            <HightLight />
          </div>
          <div style={{ fontSize: "14px", textAlign: "center" }}>
            {capsuleData.description}
          </div>

          {capsuleData.criteriaInfo.cirteriaDays ? (
            <div className="text-center mt-3">
              매주{" "}
              {capsuleData.criteriaInfo.cirteriaDays?.map((day) => (
                <span key={day.dayEn} className="font-bold">
                  {day.dayKr}{" "}
                </span>
              ))}{" "}
              기록해요
            </div>
          ) : null}

          {capsuleData.criteriaInfo.weatherStatus ||
          capsuleData.criteriaInfo.localBig ? (
            <div className="mt-3 text-center">
              {capsuleData.criteriaInfo.weatherStatus ? (
                <div>
                  <span className="font-bold">
                    {capsuleData.criteriaInfo.weatherStatus === "RAIN"
                      ? "비"
                      : capsuleData.criteriaInfo.weatherStatus === "SNOW"
                      ? "눈"
                      : null}{" "}
                    <span className="font-normal">오는 날</span>
                  </span>
                </div>
              ) : null}
              {capsuleData.criteriaInfo.localBig ? (
                <div>
                  <span className="font-bold">
                    {capsuleData.criteriaInfo.localBig}{" "}
                    {capsuleData.criteriaInfo.localMedium}{" "}
                    <span className="font-normal">에서</span>
                  </span>{" "}
                </div>
              ) : null}
              열 수 있어요.
            </div>
          ) : null}

          {capsuleData.capsuleType !== "GOAL" ? (
            <div className="my-3">
              <span className="font-bold">
                {endDateString} {capsuleData.criteriaInfo.timeKr}
              </span>{" "}
              에 공개됩니다
            </div>
          ) : null}

          {capsuleData.penalty ? (
            <div className="text-center mt-3">
              카드를 가장 적게 작성한 친구는 <br />{" "}
              <span className="font-bold">
                {capsuleData.penalty.penaltyDescription}
              </span>{" "}
              벌칙을 받아요
            </div>
          ) : null}

          <div>
            <div className="flex justify-center flex-wrap w-80">
              {capsuleData.partInfo.map((part, idx) => (
                <div key={part.userNo} className="flex flex-col">
                  {idx === 0 ? (
                    <>
                      <div className="relative">
                        <img
                          style={{
                            backgroundColor: "#fff",
                            borderRadius: "50%",
                            width: "44px",
                            height: "44px",
                            boxShadow: "0px 4px 4px rgb(0, 0, 0, 0.25)",
                            margin: "8px",
                          }}
                          src={part.profileImage}
                          alt="profilepic"
                        />
                        <img
                          src="../../assets/icons/crown.png"
                          alt="crown"
                          width="27px"
                          height="22px"
                          style={{
                            position: "absolute",
                            top: "-7px",
                            left: "16px",
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: "12px",
                          textAlign: "center",
                          width: "63px",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {part.nickname}
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="relative">
                        <img
                          style={{
                            backgroundColor: "#fff",
                            borderRadius: "50%",
                            width: "44px",
                            height: "44px",
                            boxShadow: "0px 4px 4px rgb(0, 0, 0, 0.25)",
                            margin: "8px",
                          }}
                          src={part.profileImage}
                          alt="profilepic"
                        />
                      </div>
                      <span
                        style={{
                          fontSize: "12px",
                          textAlign: "center",
                          width: "63px",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {part.nickname}
                      </span>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {capsuleData.capsuleType === "CLASSIC" ? null : (
            <>
              <div className="flex w-56 my-2 mt-5">
                {isFileAble ? (
                  <>
                    <FileIcon
                      src="../../assets/icons/file.png"
                      alt="fileicon"
                    />
                    <span onClick={openModal}>파일 첨부하기</span>
                  </>
                ) : (
                  <>
                    <FileIcon
                      src="../../assets/icons/file.png"
                      alt="fileicon"
                    />
                    <span>파일 첨부 완료</span>
                  </>
                )}

                <Modal
                  isOpen={modalIsOpen}
                  onRequestClose={closeModal}
                  style={customStyles}
                  contentLabel="Example Modal"
                >
                  <ModalContent>
                    <ModalTitle className="mb-2">
                      파일을 선택해주세요
                    </ModalTitle>
                    <div className="flex items-center">
                      타임캡슐의 남은 용량 :{" "}
                      {fileSizeData?.maxFileSize !== undefined &&
                      fileSizeData?.nowFilesize !== undefined
                        ? fileSizeData?.maxFileSize - fileSizeData?.nowFilesize
                        : "0"}
                      MB
                      <img
                        className="ml-2"
                        src="../../assets/icons/volumeUp.png"
                        alt="volumeUp"
                        width="54px"
                        onClick={() => {
                          navigate("/shop")
                        }}
                      />
                    </div>
                    <input
                      style={{ display: "none" }}
                      type="file"
                      name="file"
                      id="file"
                      accept="audio/*, video/*"
                      onChange={handleFileChange}
                    />
                    {selectedFile === null ? (
                      <FileInputBox className="flex my-4 items-center pl-3">
                        <FileIcon2
                          src="../../assets/icons/file.png"
                          alt="fileicon"
                        />
                        <label htmlFor="file">파일을 선택하세요</label>
                      </FileInputBox>
                    ) : (
                      <FileInputBox className="flex my-4 items-center pl-3">
                        <FileIcon2
                          src="../../assets/icons/file.png"
                          alt="fileicon"
                        />
                        <label htmlFor="file">{selectedFile}</label>
                      </FileInputBox>
                    )}
                    <div style={{ textAlign: "center" }}>
                      등록 후에는 삭제 및 변경할 수 없어요. <br />
                      등록하시겠어요?
                    </div>
                    <div>
                      <FileCencelBtn type="button" onClick={closeModal}>
                        취소
                      </FileCencelBtn>
                      <FileSubmitBtn onClick={handleFileSubmit}>
                        등록
                      </FileSubmitBtn>
                    </div>
                  </ModalContent>
                </Modal>
              </div>
              {isCardAble ? (
                <CardBtn
                  onClick={() => {
                    navigate(`/card/${capsuleId}`)
                  }}
                >
                  카드 작성하기
                </CardBtn>
              ) : (
                <CardCompleteBtn>카드 작성완료</CardCompleteBtn>
              )}
            </>
          )}

          <BackBtn
            onClick={() => {
              navigate(-1)
            }}
            className="my-5"
          >
            돌아가기
          </BackBtn>
        </>
      </Box>
      <div className="h-9"></div>
    </>
  )
}

interface HelpProps {
  isHelp: boolean
  setIsHelp: React.Dispatch<React.SetStateAction<boolean>>
}

const BlurBg = styled.div`
  height: 100vh;
  width: 100%;
  position: fixed;
  background-color: rgb(9, 6, 52, 0.57);
  z-index: 2;
  display: flex;
  flex-direction: column;
  color: white;
  justify-content: center;
  align-items: center;
  font-family: "Pretendard";
  overflow: hidden;
`

const CancelBtn = styled.img`
  width: 16px;
  height: 16px;
  position: absolute;
  top: 12%;
  right: 10%;
`

function HelpHost({ isHelp, setIsHelp }: HelpProps) {
  return (
    <BlurBg>
      <CancelBtn
        onClick={() => {
          setIsHelp(!isHelp)
        }}
        src="/assets/icons/cancel.png"
        alt="cancel"
      />
      <div className="flex flex-col justify-evenly h-4/6">
        <div className="text-center font-light">
          생성 후 <span style={{ color: "#FFF48E" }}>24시간</span>이 지나면{" "}
          <br />
          캡슐이 닫힙니다! <br />
          <span style={{ fontSize: "13px" }}>
            (타임캡슐 내용물 및 참가자를 수정할 수 없어요)
          </span>
        </div>

        <div className="text-center font-light">
          타임 캡슐 삭제하기 <br />
          <span style={{ fontSize: "13px" }}>
            (캡슐이 닫힌 후에는 삭제가 불가능하니 주의해 주세요!)
          </span>
        </div>

        <div className="text-center font-light">
          친구를 초대하거나 추방할 수 있어요
        </div>

        <div className="text-center font-light">영상과 음성을 남겨보아요</div>

        <div className="text-center font-light">
          타임캡슐에 안에 넣을 카드 작성해 보세요
        </div>
      </div>
    </BlurBg>
  )
}

function HelpGuest({ isHelp, setIsHelp }: HelpProps) {
  return (
    <BlurBg>
      <CancelBtn
        onClick={() => {
          setIsHelp(!isHelp)
        }}
        src="/assets/icons/cancel.png"
        alt="cancel"
      />
      <div className="flex flex-col justify-evenly h-4/6">
        <div className="text-center font-light">
          생성 후 <span style={{ color: "#FFF48E" }}>24시간</span>이 지나면{" "}
          <br />
          캡슐이 닫힙니다! <br />
          <span style={{ fontSize: "13px" }}>
            (타임캡슐 내용물 및 참가자를 수정할 수 없어요)
          </span>
        </div>

        <div className="text-center font-light">
          타임 캡슐 나가기 <br />
          <span style={{ fontSize: "13px" }}>
            (한 번 나가면{" "}
            <span style={{ color: "#FFF48E" }}>다시 들어올 수 없고</span>
            , <br />
            캡슐이 닫힌 후에는 나갈 수 없으니 주의해 주세요!)
          </span>
        </div>

        <div className="text-center font-light">
          참가인원을 확인할 수 있어요
        </div>

        <div className="text-center font-light">영상과 음성을 남겨보아요</div>

        <div className="text-center font-light">
          타임캡슐에 안에 넣을 카드 작성해 보세요
        </div>
      </div>
    </BlurBg>
  )
}

export default TimeCapsuleDetail
