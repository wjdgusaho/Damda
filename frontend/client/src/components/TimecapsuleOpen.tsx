import React from "react"

export const TimecapsuleOpen = function () {
  window.addEventListener("deviceorientation", handleOrientation)

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

      if (betaDiff > 20 || gammaDiff > 20) {
        // 휴대전화가 흔들렸을 때 실행할 코드를 여기에 작성합니다.
        console.log("휴대전화가 흔들렸습니다!")
      }
    }

    lastBeta = beta
    lastGamma = gamma
  }
  return (
    <div>
      <p>타임캡슐 열리는 모습 보이기</p>
      <p className="text-white bg-black">
        {lastBeta}, {lastGamma}
      </p>
    </div>
  )
}
