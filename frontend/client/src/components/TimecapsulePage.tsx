import React from "react"
import "../index.css"
import tw from "tailwind-styled-components"
import { styled } from "styled-components"
import { useNavigate } from "react-router"
import { SubHeader } from "./inc/SubHeader"
import { useSelector } from "react-redux"
import { RootState } from "../store/Store"

const calculateProgressPercentage = (startDate: string, endDate: string) => {
  const currentDate = new Date()
  const dateString = currentDate.toISOString().slice(0, 10)
  const total = calculateDateDifference(startDate, endDate)
  const ratio = calculateDateDifference(startDate, dateString)
  return (ratio / total) * 100
}

const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${(props) => props.theme.colorCommon};
  font-family: "Pretendard";
  margin-bottom: 30px;
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

const OpenableCard = styled(Card)`
  box-shadow: 0px 0px 8px 8px rgb(255, 245, 224, 0.5);
`

const UnregisteredCard = styled(Card)`
  background-color: rgb(0, 0, 0, 0.3);
`

const CapsuleState = styled.div`
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const CapsuleTitle = styled.div`
  width: 165px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  word-break: break-all;
`

const CapsuleImg = styled.div<{ capsuleNum: string }>`
  position: relative;
  background-image: url(${(props) =>
    props.theme["capsule" + props.capsuleNum]});
  background-repeat: no-repeat;
  background-size: cover;
  width: 87px;
  height: 87px;
  margin-left: 20px;
`

const DateDiv = styled.div`
  color: ${(props) => props.theme.colorCommon};
`
const TimecapsulePage = function () {
  const navigate = useNavigate()

  const capsuleList = useSelector(
    (state: RootState) => state.timecapsule.timecapsules
  )

  console.log(capsuleList)

  return (
    <>
      <SubHeader />
      <Box>
        <Title>진행 중인 타임캡슐</Title>
        {capsuleList.map((capsule) => (
          <React.Fragment key={capsule.timecapsuleNo}>
            {/* 등록 된 타임캡슐 */}
            {capsule.isRegisted ? (
              <>
                {calculateProgressPercentage(capsule.sDate, capsule.eDate) >=
                  100 || capsule.goalCard === capsule.curCard ? (
                  <OpenableCard
                    onClick={() => {
                      navigate(`/timecapsule/detail/${capsule.timecapsuleNo}`)
                    }}
                  >
                    <CapsuleImg capsuleNum={capsule.capsuleIconNo} />
                    <div style={{ marginLeft: "15px" }}>
                      <CapsuleState>
                        오픈가능
                        {capsule.type !== "GOAL" ? (
                          <DateDiv
                            className="text-sm font-thin"
                            style={{ opacity: "56%" }}
                          >
                            {capsule.sDate}
                          </DateDiv>
                        ) : null}
                      </CapsuleState>
                      <CapsuleTitle className="text-xl font-thin">
                        {capsule.name}
                      </CapsuleTitle>
                    </div>
                  </OpenableCard>
                ) : (
                  <>
                    {capsule.type !== "GOAL" ? (
                      <Card
                        onClick={() => {
                          navigate(
                            `/timecapsule/detail/${capsule.timecapsuleNo}`
                          )
                        }}
                      >
                        <CapsuleImg capsuleNum={capsule.capsuleIconNo} />
                        <div style={{ marginLeft: "15px" }}>
                          {capsule.type === "GOAL" ? (
                            <CapsuleState>
                              {capsule.curCard} / {capsule.goalCard}
                              <DateDiv
                                className="text-sm font-thin"
                                style={{ opacity: "56%" }}
                              >
                                {capsule.sDate}
                              </DateDiv>
                            </CapsuleState>
                          ) : (
                            <CapsuleState>
                              {calculateDday(capsule.eDate)}
                              <DateDiv
                                className="text-sm font-thin"
                                style={{ opacity: "56%" }}
                              >
                                {capsule.sDate}
                              </DateDiv>
                            </CapsuleState>
                          )}

                          <CapsuleTitle className="text-xl font-thin">
                            {capsule.name}
                          </CapsuleTitle>
                        </div>
                      </Card>
                    ) : (
                      <Card
                        onClick={() => {
                          navigate(
                            `/timecapsule/detail/${capsule.timecapsuleNo}`
                          )
                        }}
                      >
                        <CapsuleImg capsuleNum={capsule.capsuleIconNo} />
                        <div style={{ marginLeft: "15px" }}>
                          {capsule.type === "GOAL" ? (
                            <CapsuleState>
                              {capsule.curCard} / {capsule.goalCard}
                              <DateDiv
                                className="text-sm font-thin"
                                style={{ opacity: "56%" }}
                              >
                                {capsule.sDate}
                              </DateDiv>
                            </CapsuleState>
                          ) : (
                            <CapsuleState>
                              {calculateDday(capsule.eDate)}
                              <DateDiv
                                className="text-sm font-thin"
                                style={{ opacity: "56%" }}
                              >
                                {capsule.sDate}
                              </DateDiv>
                            </CapsuleState>
                          )}

                          <CapsuleTitle className="text-xl font-thin">
                            {capsule.name}
                          </CapsuleTitle>
                        </div>
                      </Card>
                    )}
                  </>
                )}
              </>
            ) : (
              <UnregisteredCard
                onClick={() => {
                  navigate(`/timecapsule/detail/${capsule.timecapsuleNo}`)
                }}
              >
                <CapsuleImg
                  className="grayscale"
                  capsuleNum={capsule.capsuleIconNo}
                />
                <div style={{ marginLeft: "15px" }}>
                  <CapsuleState>
                    등록 전
                    <DateDiv
                      className="text-sm font-thin"
                      style={{ opacity: "56%" }}
                    >
                      {capsule.sDate}
                    </DateDiv>
                  </CapsuleState>
                  <CapsuleTitle className="text-xl font-thin">
                    {capsule.name}
                  </CapsuleTitle>
                </div>
              </UnregisteredCard>
            )}
          </React.Fragment>
        ))}
      </Box>
    </>
  )
}

const calculateDday = (endDate: string) => {
  const currentDate = new Date()
  const dateString = currentDate.toISOString().slice(0, 10)

  const dday = calculateDateDifference(dateString, endDate)

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

export default TimecapsulePage
