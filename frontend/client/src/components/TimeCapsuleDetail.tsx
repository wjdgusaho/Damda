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
  /* position: absolute; */
  background-image: url(/${(props) => props.theme[props.capsuleIcon]});
  background-repeat: no-repeat;
  background-size: cover;
  width: 250px;
  height: 250px;
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

  return (
    <Box>
      <CapsuleImg capsuleIcon={capsuleData.capsuleIcon} className="grayscale" />
      <div className="text-2xl font-bold">
        {calculateDday(capsuleData.openDate)}
      </div>
      <div className="text-2xl font-bold relative">
        {capsuleData.title}
        <HightLight></HightLight>
      </div>
      <div>{capsuleData.description}</div>
      <div className="mt-3">
        <span className="font-bold">
          {endDateString} {capsuleData.criteriaInfo.timeKr}
        </span>{" "}
        에 공개됩니다
      </div>
      <div>
        {capsuleData.partInfo.map((part) => (
          <div key={part.userNo}>
            <img src={part.profileImage} alt="" />
            {part.nickname}
          </div>
        ))}
      </div>
    </Box>
  )
}

export default TimeCapsuleDetail
