import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export const TimecapsuleOpen = function () {
  const navigate = useNavigate()

  let lastAlpha: number | null = null
  let lastBeta: number | null = null
  let lastGamma: number | null = null
  let shakeCnt = 30

  const isSafariOver13 =
    window.DeviceOrientationEvent !== undefined &&
    //@ts-ignore
    typeof window.DeviceOrientationEvent.requestPermission === "function"

  useEffect(() => {
    function handleOrientation(event: { alpha: any; beta: any; gamma: any }) {
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
    if (isSafariOver13) {
      //@ts-ignore
      window.DeviceOrientationEvent.requestPermission()
        .then((state: string) => {
          if (state === "granted") {
            window.addEventListener("deviceorientation", () => {})
          } else if (state === "denied") {
            // Safari 브라우저를 종료하고 다시 접속하도록 유도하는 UX 화면 필요
          }
        })
        .catch((e: any) => {
          console.error(e)
        })
    } else {
      window.addEventListener("deviceorientation", () => {})
    }
  }

  requestPermissionSafari()

  return (
    <div className="text-center">
      {/* 여기에 타임캡슐 이미지 만들고 흔들리는 모션을 추가하세요 */}
    </div>
  )
}
