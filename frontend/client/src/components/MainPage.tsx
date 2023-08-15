import React, { useEffect, useState } from "react"
import { MainHeader } from "./inc/MainHeader"
import axios from "axios"
import { styled } from "styled-components"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { useRef, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { RootState } from "../store/Store"
import { useDispatch, useSelector } from "react-redux"
import { SET_TIMECAPSULE } from "../store/Timecapsule"
import { getLocation } from "./getLocation"

/*
1. 모든 타임캡슐의 조건 만족 여부와 밑의 3가지 경우로 나뉨.
2. 클래식(생성날짜, 만료날짜, 이름, 현재 용량, 최대 용량) 
3. 기록(생성날짜, 만료날짜, 이름, 현재 용량, 최대 용량)
4. 목표(달성률[백에서 계산해서 전송], 이름, 현재 용량, 최대 용량)
*/

export interface CapsuleType {
  timecapsuleNo: number
  type: string
  sDate: string
  eDate: string
  name: string
  capsuleIconNo: string
  curCard: number
  goalCard: number
  state: boolean
  imgsrc: string
  isRegisted: boolean
}

export const MainPage = function () {
  const slickRef = useRef<Slider>(null)
  const token = useSelector((state: RootState) => state.auth.accessToken)
  const previous = useCallback(() => slickRef.current?.slickPrev(), [])
  const next = useCallback(() => slickRef.current?.slickNext(), [])
  const [capsuleList, setCapsuleList] = useState<CapsuleType[]>([])
  const dispatch = useDispatch()

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const location = await getLocation()

        if (
          location !== null &&
          typeof location === "object" &&
          "lat" in location &&
          "lan" in location
        ) {
          const { lat, lan } = location

          const body = {
            lat: lat,
            lan: lan,
          }

          const response = await axios.post(
            process.env.REACT_APP_SERVER_URL + "timecapsule/view",
            body,
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          )

          setCapsuleList(response.data.data.timecapsuleList)
          dispatch(SET_TIMECAPSULE(response.data.data.timecapsuleList))
        } else {
          console.error("Invalid location object:", location)
        }
      } catch (error) {
        console.error(error)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="h-screen overflow-hidden">
      <MainHeader></MainHeader>
      <div className="flex flex-col h-screen justify-center">
        <div className="-mt-60"></div>
        <div className="mt-14">
          {capsuleList.length === 0 ? (
            // 타임캡슐이 하나도 없을 때
            <div className="text-center mt-6">
              <TextStyle>타임캡슐이 없어요... 아직은요! </TextStyle>
              <EmptyImage className="w-72 m-auto mt-6" />
              <CapsuleShadow className="m-auto"></CapsuleShadow>
            </div>
          ) : (
            // 타임캡슐이 한개 이상 있을 때
            <div className="">
              <Slider ref={slickRef} {...settings} className="">
                {capsuleList.map((c: CapsuleType) => (
                  <Capsule key={c.timecapsuleNo} className="text-center">
                    {c.isRegisted && (
                      <div className="relative">
                        {c.type === "GOAL" && (
                          // 목표 타임캡슐인 경우
                          <div>
                            <Dday className="m-auto">
                              {c.curCard} / {c.goalCard}
                            </Dday>
                            <CapsuleTitle>{c.name}</CapsuleTitle>
                            <ProgressBar
                              percentage={(c.curCard / c.goalCard) * 100}
                            ></ProgressBar>
                          </div>
                        )}
                        {c.type !== "GOAL" && (
                          <div>
                            <Dday className="m-auto">
                              {calculateDday(c.eDate)}
                            </Dday>
                            <CapsuleTitle>{c.name}</CapsuleTitle>
                            <ProgressBar
                              percentage={calculateProgressPercentage(
                                c.sDate,
                                c.eDate
                              )}
                            ></ProgressBar>
                          </div>
                        )}
                        {/* 열람조건을 달성하고 등록이 완료되었을때 */}
                        {c.state && c.isRegisted && (
                          <>
                            <div className="w-64 h-60 mt-14 left-1/2 -ml-32 rounded-full blur-2xl bg-white absolute">
                              {" "}
                            </div>
                            <FloatingImage
                              capsulenum={"capsule" + c.capsuleIconNo}
                              className="h-52 m-auto mt-10"
                              onClick={() => {
                                navigate(`/timecapsule/open/${c.timecapsuleNo}`)
                              }}
                            />
                          </>
                        )}
                      </div>
                    )}
                    {c.isRegisted && !c.state && (
                      <FloatingImage
                        capsulenum={"capsule" + c.capsuleIconNo}
                        className="h-52 m-auto mt-10"
                        onClick={() => {
                          navigate(`/timecapsule/detail/${c.timecapsuleNo}`)
                        }}
                      />
                    )}
                    {!c.isRegisted && (
                      // 24시간 내의 타임캡슐인 경우
                      <div>
                        <Dday className="m-auto !opacity-80 mt-2">NEW!</Dday>
                        <CapsuleTitle>{c.name}</CapsuleTitle>
                        <FloatingImage
                          capsulenum={"capsule" + c.capsuleIconNo}
                          className="h-52 m-auto mt-14 grayscale"
                          onClick={() => {
                            navigate(`/timecapsule/detail/${c.timecapsuleNo}`)
                          }}
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
            className=" w-64 h-16 flex items-center justify-center m-auto"
          >
            타임캡슐 만들기
          </MakeCapsuleButton>
          <MakeCapsuleCode
            onClick={() => {
              navigate("/participate")
            }}
            className="mt-4"
          >
            타임캡슐 코드로 참여하기
          </MakeCapsuleCode>
        </div>
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
  color: ${(props) => props.theme.colorCommon};
`
const CapsuleTitle = styled.div`
  color: ${(props) => props.theme.colorCommon};
  margin-top: 2px;
  font-size: 17px;
  opacity: 70%;
  font-weight: 700;
`

const MakeCapsuleButton = styled.div`
  border-radius: 30px;
  font-family: "pretendard";
  font-size: 20px;
  font-weight: 400;
  box-shadow: 0px 4px 4px ${(props) => props.theme.colorShadow};
  color: ${(props) => props.theme.color100};
  background-color: ${(props) => props.theme.color900};
  &:hover {
    transition: 0.2s;
    transform: scale(0.95);
    color: ${(props) => props.theme.color100};
    background-color: ${(props) => props.theme.color700};
  }
`
const MakeCapsuleCode = styled.div`
  border-radius: 30px;
  font-family: "pretendard";
  font-size: 18px;
  font-weight: 200;
  color: ${(props) => props.theme.colorCommon};
  text-decoration-line: underline;
  &:hover {
    color: ${(props) => props.theme.color900};
  }
`

const EmptyImage = styled.div`
  position: relative;
  background-image: url(${(props) => props.theme.emptyImg_1});
  background-repeat: no-repeat;
  background-size: cover;
  width: 250px;
  height: 250px;
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
const FloatingImage = styled.div<{ capsulenum: string }>`
  position: relative;
  background-image: url(${(props) => props.theme[props.capsulenum]});
  background-repeat: no-repeat;
  background-size: cover;
  width: 250px;
  height: 250px;
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
  background: ${(props) => props.theme.colorDday};
  background-clip: text; /* 텍스트 색상을 배경에 맞추기 위해 설정 */
  -webkit-background-clip: text; /* 크로스 브라우저 지원을 위해 -webkit- 접두사 사용 (일부 브라우저에 필요) */
  color: transparent;
  font-size: 40px;
`

const ProgressContainer = styled.div`
  height: 15px;
  background-color: ${(props) => props.theme.color100};
  border-radius: 10px;
  overflow: hidden;
  width: 200px;
  box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
`

const Progress = styled.div`
  height: 100%;
  background: ${(props) => props.theme.colorProgressBar};
  border-radius: 10px;
  transition: width 3s;
  border: 2px solid ${(props) => props.theme.color200};
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
  background: ${(props) => props.theme.colorShadow};
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
