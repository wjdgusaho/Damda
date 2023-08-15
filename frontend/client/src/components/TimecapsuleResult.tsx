import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"
import "../index.css"
import { styled } from "styled-components"
import { useNavigate, useParams } from "react-router"
import axios from "axios"
import { useSelector } from "react-redux"
import { RootState } from "../store/Store"
import "./datePicker.css"
import TimecapsuleResultMembers from "./TimecapsuleResultMembers"
import TimecapsuleResultImages from "./TimecapsuleResultImages"
import TimecapsuleResultRank from "./TimecapsuleResultRank"
import ReactCanvasConfetti from "react-canvas-confetti"

interface CapsuleInfoType {
  timecapsuleNo: number
  title: string
  type: string
  capsuleIconNo: string
  alone: boolean
}

type AnimationFunctionType = (options: any) => void

const TimecapsuleResult = function () {
  const { capsuleId } = useParams()
  const token = useSelector((state: RootState) => state.auth.accessToken)
  const navigate = useNavigate()
  const [comp, setComp] = useState("members")
  const [activeComponent, setActiveComponent] = useState("members")
  const [capsuleInfo, setCapsuleInfo] = useState<CapsuleInfoType | null>(null)

  const refAnimationInstance = useRef<AnimationFunctionType | null>(null)

  const getInstance = useCallback((instance: null) => {
    refAnimationInstance.current = instance
  }, [])

  const makeShot = useCallback((particleRatio: number, opts: any) => {
    refAnimationInstance.current &&
      refAnimationInstance.current({
        ...opts,
        origin: { y: 0.7 },
        particleCount: Math.floor(200 * particleRatio),
      })
  }, [])

  const fire = useCallback(() => {
    makeShot(0.25, {
      spread: 26,
      startVelocity: 55,
    })

    makeShot(0.2, {
      spread: 60,
    })

    makeShot(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    })

    makeShot(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    })

    makeShot(0.1, {
      spread: 120,
      startVelocity: 45,
    })
  }, [makeShot])

  const handleNavClick = (compName: string) => {
    setActiveComponent(compName)
  }

  useEffect(() => {
    console.log("token", token)
    const fetchData = async () => {
      try {
        const timecapsuleNo = capsuleId
        const response = await axios.get(
          process.env.REACT_APP_SERVER_URL +
            `timecapsule/simpleinfo?timecapsuleNo=${timecapsuleNo}`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        )
        console.log("---------", response.data.data.timecapsuleSimpleInfo)
        setCapsuleInfo(response.data.data.timecapsuleSimpleInfo)
      } catch (error) {
        console.error(error)
      }
    }
    fire()
    fetchData()
  }, [])

  return (
    <>
      <ReactCanvasConfetti refConfetti={getInstance} style={canvasStyles} />
      <Box>
        {capsuleInfo && (
          <CapsuleImg capsuleIcon={capsuleInfo.capsuleIconNo}></CapsuleImg>
        )}
        <>
          <div className="z-0">
            <Title className="text-2xl font-bold mb-1 mt-28">
              {capsuleInfo?.title}
            </Title>
            <div className="text-2xl font-bold relative mb-1 mt-28">
              <div className="invisible">{capsuleInfo?.title}</div>
              <HightLight />
            </div>
          </div>

          <div className="flex mb-2 mt-2">
            <Nav
              onClick={() => {
                setComp("members")
                handleNavClick("members")
              }}
              isActive={activeComponent === "members"}
            >
              상세
            </Nav>
            <Nav
              onClick={() => {
                setComp("images")
                handleNavClick("images")
              }}
              isActive={activeComponent === "images"}
            >
              카드
            </Nav>
            {/* 여러명 이상이고 목표 타임캡슐인 경우 순위 탭 보이게 하기 */}
            {!capsuleInfo?.alone && capsuleInfo?.type === "GOAL" && (
              <Nav
                onClick={() => {
                  setComp("rank")
                  handleNavClick("rank")
                }}
                isActive={activeComponent === "rank"}
              >
                순위
              </Nav>
            )}
          </div>
          {comp === "members" && <TimecapsuleResultMembers />}
          {comp === "images" && <TimecapsuleResultImages />}
          {comp === "rank" && <TimecapsuleResultRank />}
          <BackBtn
            onClick={() => {
              navigate("/savetimecapsule")
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

const Nav = styled.div<{ isActive: boolean }>`
  position: relative;
  text-decoration: none;
  font-family: "pretendard";
  font-weight: 400;
  color: ${(props) => props.theme.color700};
  transition: color 0.2s;
  display: inline-flex;
  align-items: center;
  width: 80px;
  justify-content: center;

  &::after {
    content: "";
    position: absolute;
    bottom: -5px;
    width: 100%;
    height: 1px;
    background-color: ${(props) => props.theme.color700};
    display: ${(props) => (props.isActive ? "block" : "none")};
  }
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
  min-height: 656px;
  padding: 0px 15px;
`

const Title = styled.div`
  z-index: 1;
  position: absolute;
  top: 0px;
`

const HightLight = styled.div`
  position: absolute;
  width: calc(100% + 10px);
  height: 13px;
  background-color: ${(props) => props.theme.color200};
  top: 18px;
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

const BackBtn = styled.div`
  color: ${(props) => props.theme.color950};
  font-size: 16px;
`

const canvasStyles: CSSProperties = {
  position: "absolute",
  pointerEvents: "none" as "none", // 'none'으로 타입을 강제 변환
  width: "100%",
  height: "100%",
  top: 0,
  left: 0,
}

export default TimecapsuleResult
