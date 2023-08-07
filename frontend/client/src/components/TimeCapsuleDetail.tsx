import React, { useEffect, useState } from "react"
import "../index.css"
import tw from "tailwind-styled-components"
import { styled } from "styled-components"
import { useNavigate, useParams } from "react-router"
import { SubHeader } from "./inc/SubHeader"
import axios from "axios"
import { serverUrl } from "../urls"
import { useSelector } from "react-redux"
import { RootState } from "../store/Store"
import "./datePicker.css"
import Modal from "react-modal"
import { textAlign } from "html2canvas/dist/types/css/property-descriptors/text-align"

interface DataType {
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
  maxFileSize: number
  nowFileSize: number
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
  position: absolute;
  bottom: 0;
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

const InviteBtn = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.color200};
  box-shadow: 0px 4px 4px rgb(0, 0, 0, 0.25);
  font-size: 50px;
  font-weight: 200;
  text-align: center;
  line-height: 44px;
`

const FileInput = styled.input`
  display: flex;
  background-color: rgb(0, 0, 0, 0.15);
  width: 194px;
  height: 26px;
  border-radius: 10px;
  margin-top: 15px;
`

const FriendBox = styled.div`
  width: 17rem;
  background-color: ${(props) => props.theme.color100};
  border-radius: 50px;
  padding: 30px;
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

const TimeCapsuleDetail = function () {
  const { capsuleId } = useParams()
  const token = useSelector((state: RootState) => state.auth.accessToken)
  const [capsuleData, setCapsuleData] = useState<DataType>({
    timecapsuleNo: 0,
    capsuleType: "",
    registDate: "",
    openDate: "",
    title: "",
    description: "",
    capsuleIcon: "",
    goalCard: 0,
    nowCard: 0,
    inviteCode: "",
    maxFileSize: 0,
    nowFileSize: 0,
    maxParticipant: 0,
    nowParticipant: 0,
    penalty: {
      penaltyNo: 0,
      penalty: false,
      penaltyDescription: "",
    },

    criteriaInfo: {
      criteriaId: 0,
      criteriaType: "",
      weatherStatus: "",
      startTime: "",
      endTime: "",
      localBig: "",
      localMedium: "",
      timeKr: "",
      cirteriaDays: [
        {
          dayKr: "",
          dayEn: "",
        },
      ],
    },
    myInfo: {
      userNo: 0,
      cardAble: false,
      fileAble: false,
      host: false,
    },
    partInfo: [
      {
        userNo: 0,
        nickname: "",
        profileImage: "",
      },
    ],
  })

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
        setCapsuleData(response.data.data.timecapsule)
      } catch (error) {
        console.log("Error fetching data:", error)
      }
    }

    fetchData()
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

export const Unregistered: React.FC<CapsuleProps> = ({ capsuleData }) => {
  const endDateString = capsuleData.openDate
    ? capsuleData.openDate.toString().slice(0, 10)
    : ""
  const isHost = capsuleData.myInfo.host
  const isCardAble = capsuleData.myInfo.cardAble
  const isFileAble = capsuleData.myInfo.fileAble
  const navigate = useNavigate()
  const oneDayLater = new Date(capsuleData.registDate)
  oneDayLater.setHours(oneDayLater.getHours() + 24).toString()
  const [timer, setTimer] = useState<string>("")
  const [isInvite, setIsInvite] = useState(true)
  const [isHelp, setIsHelp] = useState(false)
  const [modalIsOpen, setIsOpen] = React.useState(false)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0]
    setSelectedFile(file ? file.name : null)
  }

  function openModal() {
    setIsOpen(true)
  }

  function closeModal() {
    setIsOpen(false)
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
        const formattedHours = hours.toString().padStart(2, "0")
        const formattedMinutes = minutes.toString().padStart(2, "0")
        setTimer(`${formattedHours}:${formattedMinutes}`)
      }
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [oneDayLater])

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
          <ExitImg src="../../assets/icons/bin_dark.png" alt="bin" />
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
                <div>{capsuleData.title}</div>
              </div>
              <div style={{ fontSize: "14px" }}>{capsuleData.description}</div>
              {capsuleData.capsuleType !== "CLASSIC" ? (
                <div className="text-center mt-3">
                  타임캡슐이 등록되고 나면 <br />
                  매일 1장의 카드와 파일을 업로드 할 수 있어요
                </div>
              ) : null}

              {capsuleData.penalty ? (
                <div className="text-center mt-3">
                  카드를 가장 적게 작성한 친구는 <br />{" "}
                  <span className="font-bold">
                    {capsuleData.penalty?.penaltyDescription}
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
                              style={{ fontSize: "12px", textAlign: "center" }}
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
                              style={{ fontSize: "12px", textAlign: "center" }}
                            >
                              {part.nickname}
                            </span>
                          </>
                        )}
                      </div>
                    ))}
                    <InviteBtn
                      onClick={() => {
                        setIsInvite(false)
                      }}
                    >
                      +
                    </InviteBtn>
                  </div>
                ) : null}
                {/* 여기 일단 임시로 null (방장 아닐 때) */}
              </div>

              {capsuleData.capsuleType === "CLASSIC" ? (
                <>
                  <div className="flex w-56 my-2 mt-5">
                    <FileIcon
                      src="../../assets/icons/file.png"
                      alt="fileicon"
                    />
                    <span onClick={openModal}>파일 첨부하기</span>

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
                          {capsuleData.maxFileSize - capsuleData.nowFileSize} MB
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
                          <FileCencelBtn onClick={closeModal}>
                            취소
                          </FileCencelBtn>
                          <FileSubmitBtn>등록</FileSubmitBtn>
                        </div>
                      </ModalContent>
                    </Modal>
                  </div>
                  {isCardAble ? (
                    <CardBtn
                      onClick={() => {
                        navigate("/card")
                      }}
                    >
                      카드 작성하기
                    </CardBtn>
                  ) : (
                    <CardCompleteBtn>카드 작성완료</CardCompleteBtn>
                  )}
                </>
              ) : null}

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
              </div>
              <FriendBox className="flex flex-col mt-2">
                <div>친구목록</div>
                생각이 많은 건 말이야 당연히 해야 할 일이야 나에겐 우리가 지금
                일순위야 안전한 유리병을 핑계로 바람을 가둬 둔 것 같지만 기억나?
                그날의 우리가 잡았던 그 손엔 말이야 설레임보다 커다란 믿음이
                담겨서 난 함박웃음을 지었지만 울음이 날 것도 같았어
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
      </Background>
    </div>
  )
}

export const Proceeding: React.FC<CapsuleProps> = ({ capsuleData }) => {
  const endDateString = capsuleData.openDate.toString().slice(0, 10)
  const navigate = useNavigate()
  const isCardAble = capsuleData.myInfo.cardAble

  return (
    <>
      <SubHeader />
      <Box>
        <CapsuleImg capsuleIcon={capsuleData.capsuleIcon} />
        <>
          <div className="text-2xl font-bold mt-28">
            {calculateDday(capsuleData.openDate)}
          </div>
          <Title className="text-2xl font-bold relative mb-1">
            {capsuleData.title}
          </Title>
          <div className="text-2xl font-bold relative mb-1">
            <div>{capsuleData.title}</div>
            <HightLight />
          </div>
          <div style={{ fontSize: "14px" }}>{capsuleData.description}</div>

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
            <>
              <div className="text-center mt-3">
                <span className="font-bold">
                  {capsuleData.criteriaInfo.weatherStatus}
                </span>{" "}
                오는 날 <br />
                <span className="font-bold">
                  {capsuleData.criteriaInfo.localBig}{" "}
                  {capsuleData.criteriaInfo.localMedium}
                </span>
                에서 열 수 있어요
              </div>
            </>
          ) : null}

          <div className="my-3">
            <span className="font-bold">
              {endDateString} {capsuleData.criteriaInfo.timeKr}
            </span>{" "}
            에 공개됩니다
          </div>
          <div>
            <div className="flex justify-center flex-wrap w-80">
              {capsuleData.partInfo.map((part, idx) => (
                <div key={part.userNo} className="flex flex-col">
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
                    <span style={{ fontSize: "12px", textAlign: "center" }}>
                      {part.nickname}
                    </span>
                  </>
                </div>
              ))}
            </div>
          </div>

          {capsuleData.capsuleType === "CLASSIC" ? null : (
            <>
              <div className="flex w-56 my-2 mt-5">
                <FileIcon src="../../assets/icons/file.png" alt="fileicon" />
                <FileInput
                  type="file"
                  name="file"
                  id="file"
                  accept="audio/*, video/*"
                />
              </div>
              {isCardAble ? (
                <CardBtn
                  onClick={() => {
                    navigate("/card")
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
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgb(9, 6, 52, 0.57);
  z-index: 2;
  display: flex;
  flex-direction: column;
  color: white;
  justify-content: center;
  align-items: center;
  font-family: "Pretendard";
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
