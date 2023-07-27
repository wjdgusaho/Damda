import React from "react"
import { MainHeader } from "./inc/MainHeader"
import { SubHeader } from "./inc/SubHeader"

import { styled } from "styled-components"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { useRef, useCallback } from "react"
import { useNavigate } from "react-router-dom"

/*
1. 모든 타임캡슐의 조건 만족 여부와 밑의 3가지 경우로 나뉨.
2. 클래식(생성날짜, 만료날짜, 이름, 현재 용량, 최대 용량) 
3. 기록(생성날짜, 만료날짜, 이름, 현재 용량, 최대 용량)
4. 목표(달성률[백에서 계산해서 전송], 이름, 현재 용량, 최대 용량)
*/

type CapsuleType = {
  id: number
  type: string
  sDate: string
  eDate: string
  name: string
  imgsrc: string
  curCard: number
  goalCard: number
}

const capsuleList: CapsuleType[] = [
  {
    id: 4,
    type: "new",
    sDate: "2023-01-01",
    eDate: "2023-06-01",
    name: "클래식1",
    imgsrc: "assets/Planet-6.png",
    curCard: 0,
    goalCard: 0,
  },
  {
    id: 1,
    type: "classic",
    sDate: "2023-01-01",
    eDate: "2023-06-01",
    name: "클래식1",
    imgsrc: "assets/Planet-6.png",
    curCard: 0,
    goalCard: 0,
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
  },
]

const MainPage = function () {
  const slickRef = useRef<Slider>(null)

  const previous = useCallback(() => slickRef.current?.slickPrev(), [])
  const next = useCallback(() => slickRef.current?.slickNext(), [])

  const settings = {
    centerMode: false,
    arrows: false,
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  }

  const navigate = useNavigate()

  return (
    <div>
      <MainHeader></MainHeader>
      <div>
        <img
          className="absolute w-10 right-0 mr-10 mt-10"
          src="assets/icons/questionMark.png"
          alt="도움말"
        />
      </div>
      <div className="mt-14">
        {capsuleList.length === 0 ? (
          // 타임캡슐이 하나도 없을 때
          <div className="text-center mt-20">
            <TextStyle className="text-victoria-400">
              타임캡슐이 없어요... 아직은요!{" "}
            </TextStyle>
            <img
              className="w-72 m-auto mt-12"
              src="assets/Astronaut-3.png"
              alt="Astronaut-3"
            />
            <CapsuleShadow className="m-auto"></CapsuleShadow>
          </div>
        ) : (
          // 타임캡슐이 한개 이상 있을 때
          <div className="">
            <Slider ref={slickRef} {...settings} className="">
              {capsuleList.map((c) => (
                <Capsule key={c.id} className="text-center">
                  {c.type !== "new" && (
                    <div className="relative">
                      {c.type === "goal" && (
                        // 목표 타임캡슐인 경우
                        <div>
                          <Dday className="m-auto">
                            {c.curCard} / {c.goalCard}
                          </Dday>
                          <ProgressBar
                            percentage={(c.curCard / c.goalCard) * 100}
                          ></ProgressBar>
                        </div>
                      )}
                      {c.type !== "goal" && (
                        <div>
                          <Dday className="m-auto">
                            {calculateDday(c.eDate)}
                          </Dday>
                          <ProgressBar
                            percentage={calculateProgressPercentage(
                              c.sDate,
                              c.eDate
                            )}
                          ></ProgressBar>
                        </div>
                      )}
                      {/* 퍼센트가 다 찼을 때 */}
                      {calculateProgressPercentage(c.sDate, c.eDate) >= 100 && (
                        <div className="w-64 h-60 mt-14 left-1/2 -ml-32 rounded-full blur-2xl bg-lilac-50 absolute"></div>
                      )}
                      <FloatingImage
                        className="h-52 m-auto mt-20"
                        src={c.imgsrc}
                        alt="타임캡슐"
                      />
                    </div>
                  )}
                  {c.type === "new" && (
                    // 24시간 내의 타임캡슐인 경우
                    <div>
                      <Dday className="m-auto !text-white !opacity-80 mt-2">
                        NEW!
                      </Dday>
                      <FloatingImage
                        className="h-52 m-auto mt-24 grayscale"
                        src={c.imgsrc}
                        alt="타임캡슐"
                      />
                    </div>
                  )}
                  <CapsuleShadow className="m-auto mt-2"></CapsuleShadow>
                </Capsule>
              ))}
            </Slider>
            <div onClick={previous}>
              <img
                className="fixed w-8 left-5 top-1/2"
                src="assets/icons/arrow_l.png"
                alt="왼쪽화살표"
              />
            </div>
            <div onClick={next}>
              <img
                className="fixed w-8 right-5 top-1/2"
                src="assets/icons/arrow_r.png"
                alt="오른쪽화살표"
              />
            </div>
          </div>
        )}
      </div>
      <div className="text-center mt-8 fixed bottom-4 left-0 right-0">
        <MakeCapsuleButton
          onClick={() => {
            navigate("/selecttype")
          }}
          className="bg-lilac-100 w-64 h-16 flex items-center justify-center m-auto text-lilac-950 hover:bg-lilac-500"
        >
          타임캡슐 만들기
        </MakeCapsuleButton>
        <MakeCapsuleCode
          onClick={() => {
            navigate("/participate")
          }}
          className="mt-4 hover:text-lilac-900"
        >
          타임캡슐 코드로 참여하기
        </MakeCapsuleCode>
      </div>
    </div>
  )
}

const ProgressBar = ({ percentage }: ProgressBarProps) => {
  return (
    <ProgressContainer className="m-auto mt-3">
      <Progress style={{ width: `${percentage}%` }}></Progress>
    </ProgressContainer>
  )
}

const TextStyle = styled.div`
  font-family: "pretendard";
  font-size: 20px;
  font-weight: 200;
`
const MakeCapsuleButton = styled.div`
  border-radius: 30px;
  font-family: "pretendard";
  font-size: 20px;
  font-weight: 400;
  box-shadow: 0px 4px 4px #534177;

  &:hover {
    transition: 0.2s;
    transform: scale(0.95);
  }
`
const MakeCapsuleCode = styled.div`
  border-radius: 30px;
  font-family: "pretendard";
  font-size: 18px;
  font-weight: 200;
  color: #ffffff;
  text-decoration-line: underline;
`

const FloatingImage = styled.img`
  /* 기본 위치를 설정합니다. */
  position: relative;
  top: 0;

  @keyframes floatingAnimation {
    0% {
      transform: translateY(0); /* 시작 위치 (위치 이동 없음) */
    }
    50% {
      transform: translateY(-10px); /* 위로 10px 이동 */
    }
    100% {
      transform: translateY(0); /* 다시 원래 위치로 이동 */
    }
  }
  animation: floatingAnimation 2s ease-in-out infinite;
`

const Dday = styled.div`
  font-family: "PyeongChangPeaceBold";
  background: linear-gradient(90deg, #a247c1 -19.12%, #ffb86c 117.65%);
  background-clip: text; /* 텍스트 색상을 배경에 맞추기 위해 설정 */
  -webkit-background-clip: text; /* 크로스 브라우저 지원을 위해 -webkit- 접두사 사용 (일부 브라우저에 필요) */
  color: transparent; /* 텍스트 색상을 투명하게 설정 */
  font-size: 40px;
`

const ProgressContainer = styled.div`
  height: 15px;
  background-color: #efe0f4;
  border-radius: 10px;
  overflow: hidden;
  width: 200px;
  box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
`

const Progress = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #a247c1 -19.12%, #ffb86c 117.65%);
  border-radius: 10px;
  transition: width 3s;
  border: 2px solid #ded1e3;
  box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
`

const Capsule = styled.div`
  font-family: "pretendard";
  font-weight: 300;
  padding: 10px;
`

const CapsuleShadow = styled.div`
  width: 205px;
  height: 80px;
  border-radius: 50%;
  background: #513a71;
  filter: blur(5px);
`

interface ProgressBarProps {
  percentage: number
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
const calculateProgressPercentage = (startDate: string, endDate: string) => {
  const currentDate = new Date()
  const dateString = currentDate.toISOString().slice(0, 10)
  const total = calculateDateDifference(startDate, endDate)
  const ratio = calculateDateDifference(startDate, dateString)
  return (ratio / total) * 100
}

export default MainPage
