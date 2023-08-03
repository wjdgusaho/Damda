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
    localMedium: string
    timeKr: string
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
  const differenceInDays = differenceInTime / (1000 * 3600 * 24) // Convert milliseconds to days
  return differenceInDays
}

const Box = styled.div`
  z-index: -2;
  display: flex;
  flex-direction: column;
  position: relative;
  justify-content: center;
  align-items: center;
  margin: auto;
  width: 20rem;
  background-color: ${(props) => props.theme.color50};
  border-radius: 50px;
  font-family: "Pretendard";
  margin-top: 150px;
  box-shadow: 0px 4px 4px 4px rgb(0, 0, 0, 0.25);
  color: ${(props) => props.theme.color900};
`

const HightLight = styled.div`
  position: absolute;
  z-index: -1;
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
`

const FileIcon = styled.img`
  width: 18px;
  height: 18px;
  margin-top: 2px;
  margin-right: 5px;
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
      localMedium: "",
      timeKr: "",
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
      <SubHeader />
      {isRegistered ? <Unregistered capsuleData={capsuleData} /> : null}
    </>
  )
}

interface CapsuleProps {
  capsuleData: DataType
}

export const Unregistered: React.FC<CapsuleProps> = ({ capsuleData }) => {
  const endDateString = capsuleData.openDate.toString().slice(0, 10)
  const isHost = capsuleData.myInfo.host
  const isCardAble = capsuleData.myInfo.cardAble
  const isFileAble = capsuleData.myInfo.fileAble
  const navigate = useNavigate()

  return (
    <Box>
      <CapsuleImg capsuleIcon={capsuleData.capsuleIcon} className="grayscale" />
      <div className="text-2xl font-bold mt-28">
        {calculateDday(capsuleData.openDate)}
      </div>
      <div className="text-2xl font-bold relative">
        {capsuleData.title}
        <HightLight />
      </div>
      <div>{capsuleData.description}</div>
      <div className="my-3">
        <span className="font-bold">
          {endDateString} {capsuleData.criteriaInfo.timeKr}
        </span>{" "}
        에 공개됩니다
      </div>
      <div>
        {isHost ? (
          <div className="flex justify-center align-middle">
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
                    <span style={{ fontSize: "12px", textAlign: "center" }}>
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
                    <span style={{ fontSize: "12px", textAlign: "center" }}>
                      {part.nickname}
                    </span>
                  </>
                )}
              </div>
            ))}
            <InviteBtn>+</InviteBtn>
          </div>
        ) : null}
        {/* 여기 일단 임시로 null (방장 아닐 때) */}
      </div>
      <div className="flex w-56 my-2">
        <FileIcon src="../../assets/icons/file.png" alt="fileicon" />
        <span>파일 첨부하기</span>
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

      <BackBtn className="my-5">돌아가기</BackBtn>
    </Box>
  )
}

export default TimeCapsuleDetail
