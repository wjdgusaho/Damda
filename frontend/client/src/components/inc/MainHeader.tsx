import React from "react"
import { useNavigate } from "react-router-dom"
import { styled } from "styled-components"

const TextStyle = styled.p`
  font-family: "pretendard";
  font-weight: 300;
`

export const MainHeader = function () {
  const navigate = useNavigate()
  return (
    <div>
      <div className="w-10/12 m-auto mt-12 flex justify-between">
        <div className="bg-victoria-50 text-victoria-900 opacity-80 flex justify-center items-center w-20 rounded-lg">
          <TextStyle>테마설정</TextStyle>
        </div>
        <div className="flex items-center">
          <img src="assets/icons/alerm.png" alt="알림" className="mr-6" />
          <img
            onClick={() => {
              navigate("/menu")
            }}
            src="assets/icons/menu.png"
            alt="메뉴"
            className="h-6"
          />
        </div>
      </div>
      <div className="flex items-center justify-end mr-8 mt-8">
        <TextStyle className="text-victoria-50 opacity-80 mr-2">
          날씨, 위치 업데이트 하기
        </TextStyle>
        <img src="assets/icons/refresh.png" alt="새로고침" className="h-7" />
      </div>
    </div>
  )
}
