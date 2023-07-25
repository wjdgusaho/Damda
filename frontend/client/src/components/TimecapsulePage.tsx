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
}

const capsuleList: CapsuleType[] = [
  {
    id: 1,
    type: "classic",
    sDate: "2023-01-01",
    eDate: "2023-06-01",
    name: "클래식1",
    imgsrc: "assets/Planet-6.png",
    curCard: 0,
    goalCard: 0,
    state: "openable",
  },
  {
    id: 3,
    type: "memory",
    sDate: "2023-01-01",
    eDate: "2023-02-30",
    name: "기록1",
    imgsrc: "assets/Planet-7.png",
    curCard: 0,
    goalCard: 0,
    state: "openable",
  },
  {
    id: 4,
    type: "new",
    sDate: "2023-01-01",
    eDate: "2023-06-01",
    name: "클래식1",
    imgsrc: "assets/Planet-6.png",
    curCard: 0,
    goalCard: 0,
    state: "unregistered",
  },
  {
    id: 2,
    type: "goal",
    sDate: "2023-01-01",
    eDate: "2024-01-01",
    name: "목표1",
    imgsrc: "assets/Planet-5.png",
    curCard: 50,
    goalCard: 100,
    state: "proceeding",
  },
]

const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  font-family: "Pretendard";
`

const Title = tw.div`
    mt-14
    text-xl
    font-extralight
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

const CapsuleImg = styled.img`
  width: 87px;
  height: 87px;
  margin-left: 20px;
`

const OpenableCard = styled(Card)`
  box-shadow: 0px 0px 8px 8px rgb(255, 245, 224, 0.5);
`

const UnregisteredCard = styled(Card)`
  background-color: rgb(0, 0, 0, 0.3);
`

const CapsuleTitle = styled.div``

const TimecapsulePage = function () {
  return (
    <>
      <SubHeader />
      <Box>
        <Title>진행 중인 타임캡슐</Title>
        {capsuleList.map((capsule) => (
          <React.Fragment key={capsule.id}>
            {capsule.state === "openable" ? (
              <OpenableCard>
                <CapsuleImg src={`${capsule.imgsrc}`} alt="capsuleImg" />
                <div style={{ marginLeft: "15px" }}>
                  <CapsuleTitle>
                    오픈가능 <span> {capsule.eDate} </span>
                  </CapsuleTitle>
                  <div> {capsule.name} </div>
                </div>
              </OpenableCard>
            ) : capsule.state === "unregistered" ? (
              <UnregisteredCard>
                <CapsuleImg
                  className="grayscale"
                  src={`${capsule.imgsrc}`}
                  alt="capsuleImg"
                />
              </UnregisteredCard>
            ) : (
              <Card>
                <CapsuleImg src={`${capsule.imgsrc}`} alt="capsuleImg" />
              </Card>
            )}
          </React.Fragment>
        ))}
      </Box>
    </>
  )
}

export default TimecapsulePage
