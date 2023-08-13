import React, { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

export const TimecapsuleOpen = function () {
  const navigate = useNavigate()
  const { capsuleId } = useParams()

  let lastAlpha: number | null = null
  let lastBeta: number | null = null
  let lastGamma: number | null = null
  let shakeCnt = 30

  useEffect(() => {
    window.addEventListener("deviceorientation", handleOrientation)

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation)
    }
  }, [])

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
        shakeCnt--
        if (shakeCnt <= 0) {
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
    <div className="text-center">
      {/* 여기에 타임캡슐 이미지 만들고 흔들리는 모션 만들어 주세요. */}
    </div>
  )
}
