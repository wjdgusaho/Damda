import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { PieChart } from "react-minimal-pie-chart"
import { styled } from "styled-components"
import axios from "axios"
import { useSelector } from "react-redux"
import { RootState } from "../store/Store"
import { serverUrl } from "../urls"

interface CapsuleInfoType {
  timecapsuleNo: number
  title: string
  type: string
  capsuleIconNo: string
}

export const TimecapsuleOpen = function () {
  const navigate = useNavigate()
  const { capsuleId } = useParams()
  const token = useSelector((state: RootState) => state.auth.accessToken)
  const [capsuleInfo, setCapsuleInfo] = useState<CapsuleInfoType | null>(null)
  const [shakeCnt, setShakeCnt] = useState(1)

  let lastAlpha: number | null = null
  let lastBeta: number | null = null
  let lastGamma: number | null = null

  useEffect(() => {
    console.log("token", token)
    const fetchData = async () => {
      try {
        const timecapsuleNo = capsuleId
        const response = await axios.get(
          serverUrl + `timecapsule/simpleinfo?timecapsuleNo=${timecapsuleNo}`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        )
        setCapsuleInfo(response.data.data.timecapsuleSimpleInfo)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    window.addEventListener("deviceorientation", handleOrientation)

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation)
    }
  }, [])

  useEffect(() => {
    console.log("shakeCnt : ", shakeCnt)
    if (shakeCnt >= 100) {
      navigate(`/timecapsule/result/${capsuleId}`)
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

      if (betaDiff > 70 || gammaDiff > 70 || alphaDiff > 110) {
        // 휴대전화가 흔들렸을 때 실행할 코드를 여기에 작성합니다.
        navigator.vibrate([100, 100, 100, 100])
        setShakeCnt(shakeCnt + 3)
        if (shakeCnt >= 100) {
          // 여기에 다음 열린 후에 페이지로 들어가도록 만들어주세요.
          navigate(`/result/${capsuleId}`)
        }
      }
    }

    lastAlpha = alpha
    lastBeta = beta
    lastGamma = gamma
  }

  console.log(lastAlpha)
  console.log(lastBeta)
  console.log(lastGamma)

  return (
    <div>
      {/* 여기에 타임캡슐 이미지 만들고 흔들리는 모션 만들어 주세요. */}
      <InfoText className="absolute mt-28 ml-6 font-pretendard font-semibold text-xl">
        원이 차오를 때 까지
        <br />
        타임캡슐을 흔들거나 터치해주세요!
      </InfoText>
      <FloatingImage
        capsulenum={capsuleInfo?.capsuleIconNo ?? "capsule1"}
        onClick={() => {
          setShakeCnt(shakeCnt + 3)
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
    </div>
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
