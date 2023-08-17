import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { PieChart } from "react-minimal-pie-chart"
import { styled } from "styled-components"
import axios from "axios"
import { useSelector } from "react-redux"
import { RootState } from "../store/Store"
import { motion } from "framer-motion"

interface CapsuleInfoType {
  timecapsuleNo: number
  title: string
  type: string
  capsuleIconNo: string
}
let shakeCnt = 1

export const TimecapsuleOpen = function () {
  const navigate = useNavigate()
  const { capsuleId } = useParams()
  const token = useSelector((state: RootState) => state.auth.accessToken)
  const [capsuleInfo, setCapsuleInfo] = useState<CapsuleInfoType | null>(null)
  // const [shakeCnt, setShakeCnt] = useState(1)

  let lastAlpha: number | null = null
  let lastBeta: number | null = null
  let lastGamma: number | null = null

  useEffect(() => {
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
        setCapsuleInfo(response.data.data.timecapsuleSimpleInfo)
        // 타임캡슐의 정보를 받은 후에 해당 타임캡슐을 열람한 타임캡슐로 처리함
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [])

  const makeSaved = async () => {
    try {
      const response = await axios.patch(
        process.env.REACT_APP_SERVER_URL + `timecapsule/open/save`,
        {
          timecapsuleNo: capsuleId,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
      if (response.data.code === 200) {
        console.log("타임캡슐 열람 성공")
      } else {
        console.log(response.data.message)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    window.addEventListener("deviceorientation", handleOrientation)

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation)
    }
  }, [])

  useEffect(() => {
    if (shakeCnt >= 100) {
      makeSaved()
      navigate(`/timecapsule/result/${capsuleId}`)
      shakeCnt = 1
    }
    return () => {
      shakeCnt = 1
    }
  }, [shakeCnt])

  function handleOrientation(event: DeviceOrientationEvent) {
    const { alpha, beta, gamma } = event

    if (lastAlpha === null || lastBeta === null || lastGamma === null) {
      lastAlpha = alpha
      lastBeta = beta
      lastGamma = gamma
      return
    }

    if (alpha && beta && gamma) {
      const alphaDiff = Math.abs(alpha - lastAlpha)
      const betaDiff = Math.abs(beta - lastBeta)
      const gammaDiff = Math.abs(gamma - lastGamma)

      if (betaDiff > 50 || gammaDiff > 50 || alphaDiff > 90) {
        // 휴대전화가 흔들렸을 때 실행할 코드를 여기에 작성합니다.
        navigator.vibrate([100, 100, 100, 100])
        shakeCnt = shakeCnt + 3
        // setShakeCnt(shakeCnt + 3)
      }
    }

    lastAlpha = alpha
    lastBeta = beta
    lastGamma = gamma
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* 여기에 타임캡슐 이미지 만들고 흔들리는 모션 만들어 주세요. */}
      <InfoText className="absolute mt-28 ml-6 font-pretendard font-semibold text-xl">
        원이 차오를 때 까지
        <br />
        타임캡슐을 흔들거나 터치해주세요!
      </InfoText>
      <FloatingImage
        capsulenum={capsuleInfo?.capsuleIconNo ?? "capsule1"}
        onClick={() => {
          shakeCnt = shakeCnt + 3
          // setShakeCnt(shakeCnt + 3)
        }}
      ></FloatingImage>
      <div>
        <PieChart
          className="w-80 absolute left-1/2 -ml-40"
          data={[{ value: shakeCnt, color: "#ffffff", name: "name1" }]}
          reveal={shakeCnt}
          lineWidth={15} //도넛 두께
          background="#ffffff4b"
          lengthAngle={360}
          rounded
          animate
        />
      </div>
    </motion.div>
  )
}

const FloatingImage = styled.div<{ capsulenum: string }>`
  position: absolute;
  top: 50%;
  margin-top: -125px;
  left: 50%;
  margin-left: -125px;
  background-image: url(/${(props) => props.theme[props.capsulenum]});
  background-repeat: no-repeat;
  background-size: cover;
  width: 250px;
  height: 250px;
  z-index: 1;
  &:active {
    transform: scale(0.9);
    transition: 0.2s;
  }
`

const InfoText = styled.div`
  color: ${(props) => props.theme.colorCommon};
`
