import React, { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"

// DeviceOrientationEvent 인터페이스에 requestPermission 메서드를 추가한 선언
declare global {
  interface DeviceOrientationEvent {
    requestPermission?: () => Promise<PermissionState>
  }
}

export const TimecapsuleOpen = function () {
  const navigate = useNavigate()
  const { capsuleId } = useParams()

  let lastAlpha: number | null = null
  let lastBeta: number | null = null
  let lastGamma: number | null = null
  let shakeCnt = 30

  useEffect(() => {
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
          navigator.vibrate([100, 100, 100, 100])
          shakeCnt--
          if (shakeCnt <= 0) {
            navigate("/main")
          }
        }
      }
      lastAlpha = alpha
      lastBeta = beta
      lastGamma = gamma
    }

    window.addEventListener("deviceorientation", handleOrientation)

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation)
    }
  }, [navigate])

  const requestPermissionSafari = () => {
    ;(window.DeviceOrientationEvent as any)
      .requestPermission()
      .then((state: PermissionState) => {
        if (state === "granted") {
          window.addEventListener("deviceorientation", () => {})
        } else if (state === "denied") {
          // Safari 브라우저를 종료하고 다시 접속하도록 유도하는 UX 화면 필요
        }
      })
      .catch((e: Error) => {
        console.error(e)
      })
  }

  requestPermissionSafari()

  return (
    <div className="text-center">
      {/* 여기에 타임캡슐 이미지 만들고 흔들리는 모션을 추가하세요 */}
    </div>
  )
}
