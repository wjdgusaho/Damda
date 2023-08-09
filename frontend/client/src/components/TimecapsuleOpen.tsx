import React, { useEffect } from "react"

export const TimecapsuleOpen = function () {
  let lastBeta: number | null = null
  let lastGamma: number | null = null
  function handleOrientation(event: DeviceOrientationEvent) {
    const { alpha, beta, gamma } = event

    if (lastBeta === null || lastGamma === null) {
      lastBeta = beta
      lastGamma = gamma
      return
    }

    if (beta && gamma) {
      const betaDiff = Math.abs(beta - lastBeta)
      const gammaDiff = Math.abs(gamma - lastGamma)

      if (betaDiff > 10 || gammaDiff > 10) {
        // 휴대전화가 흔들렸을 때 실행할 코드를 여기에 작성합니다.
        console.log("휴대전화가 흔들렸습니다!")
      }
    }

    lastBeta = beta
    lastGamma = gamma
  }

  useEffect(() => {
    window.addEventListener("deviceorientation", handleOrientation)

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation)
    }
  }, [])
  return <div className="text-center"></div>
}
