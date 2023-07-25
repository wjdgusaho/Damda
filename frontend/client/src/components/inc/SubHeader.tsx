import React from "react"
import { useNavigate } from "react-router-dom"
import { styled } from "styled-components"

const TextStyle = styled.p`
  font-family: "pretendard";
  font-weight: 500;
  font-size: 20px;
`

export const SubHeader = function () {
  const navigate = useNavigate()

  const goBack = () => {
    navigate(-1); // 뒤로가기
  };

  return (
    <div>
      <div className="w-10/12 m-auto mt-12 flex justify-between">
        <img
          onClick={goBack}
          src="/assets/icons/arrow_l.png"
          alt="메뉴"
          className="h-6"
        />
        <div className="flex items-center opacity-70"
          onClick={() => {
            navigate("/main")
          }}
        >
          <img src="/assets/icons/home.png" alt="알림" className="mr-4 w-6" />
          <TextStyle className="text-white">홈으로</TextStyle>
        </div>
      </div>
    </div>
  )
}
