import React from "react"
import "../index.css"
import tw from "tailwind-styled-components"
import { styled } from "styled-components"
import { useNavigate } from "react-router"
import { SubHeader } from "./inc/SubHeader"

type CapsuleType = {
  id: number
  type: string
  sDate: string
  eDate: string
  name: string
  imgsrc: string
  curCard: number
  goalCard: number
  state: string
  title: string
}

const capsuleList: CapsuleType[] = [
  {
    id: 1,
    type: "classic",
    sDate: "2023-01-01",
    eDate: "2023-06-01",
    name: "클래식1",
    imgsrc: "capsule9",
    curCard: 0,
    goalCard: 0,
    state: "openable",
    title: "싸피 친구들 타임캡슐",
  },
  {
    id: 3,
    type: "memory",
    sDate: "2023-01-01",
    eDate: "2023-02-30",
    name: "기록1",
    imgsrc: "capsule7",
    curCard: 0,
    goalCard: 0,
    state: "openable",
    title: "퇴사하고 싶은 사람들",
  },
]

const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${(props) => props.theme.colorCommon};
  font-family: "Pretendard";
`
const DateDiv = styled.div`
  color: ${(props) => props.theme.colorCommon};
`

const Title = tw.div`
    mt-14
    text-xl
    font-normal
`

const Card = styled.div`
  display: flex;
  width: 318px;
  height: 126px;
  background-color: rgba(251, 248, 252, 0.1);
  border-radius: 30px;
  margin-top: 30px;
  align-items: center;
`

const CapsuleImg = styled.div<{ capsuleNum: string }>`
  position: relative;
  background-image: url(${(props) => props.theme[props.capsuleNum]});
  background-repeat: no-repeat;
  background-size: cover;
  width: 87px;
  height: 87px;
  margin-left: 20px;
`

const CapsuleState = styled.div`
  font-size: 20px;
  display: flex;
`

const CapsuleTitle = styled.div`
  width: 165px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  word-break: break-all;
`

const SavedTimecapsule = function () {
  return (
    <>
      <SubHeader />
      <Box>
        <Title>저장된 타임캡슐</Title>
        {capsuleList.map((capsule) => (
          <React.Fragment key={capsule.id}>
            <Card>
              <CapsuleImg capsuleNum={capsule.imgsrc} />
              <div style={{ marginLeft: "15px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <CapsuleState>
                    {calculateDday(capsule.sDate, capsule.eDate)}
                    <span className="font-thin opacity-75">간의 기록</span>
                  </CapsuleState>
                  <img
                    src="../../assets/icons/bin.png"
                    alt="bin"
                    style={{ width: "20px", height: "20.5px" }}
                  />
                </div>
                <DateDiv
                  className="text-sm font-thin"
                  style={{ opacity: "56%" }}
                >
                  {capsule.sDate.split("-").join(".")} ~{" "}
                  {capsule.eDate.split("-").join(".")}
                </DateDiv>
                <CapsuleTitle className="text-xl font-thin">
                  {capsule.title}
                </CapsuleTitle>
              </div>
            </Card>
          </React.Fragment>
        ))}
      </Box>
    </>
  )
}

const calculateDday = (startDate: string, endDate: string) => {
  const dday = calculateDateDifference(startDate, endDate)
  const ddayPrint = dday + "일"
  return ddayPrint
}

const calculateDateDifference = (startDate: string, endDate: string) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const differenceInTime = end.getTime() - start.getTime()
  const differenceInDays = differenceInTime / (1000 * 3600 * 24) // Convert milliseconds to days
  return differenceInDays
}

export default SavedTimecapsule
