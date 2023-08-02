import React from "react"
import { useNavigate } from "react-router-dom"
import { styled } from "styled-components"

const TextStyle = styled.p`
  font-family: "pretendard";
  font-weight: 500;
  font-size: 20px;
  color: ${(props) => props.theme.colorCommon};
  opacity: 80%;
`
const BackIcon = styled.div`
  background-image: url(${(props) =>
    props.theme.colorCommon === "black"
      ? "..//assets/icons/arrow_lD.png"
      : "..//assets/icons/arrow_l.png"});
  background-repeat: no-repeat;
  background-size: contain;
  width: 15px;
  height: 25px;
`
const HomeIcon = styled.div`
  background-image: url(${(props) =>
    props.theme.colorCommon === "black"
      ? "..//assets/icons/homeD.png"
      : "..//assets/icons/home.png"});
  background-repeat: no-repeat;
  background-size: contain;
  width: 25px;
  height: 25px;
`
export const SubHeader = function () {
  const navigate = useNavigate()

  const goBack = () => {
    navigate(-1) // 뒤로가기
  }

  return (
    <div>
      <div className="w-10/12 m-auto mt-12 flex justify-between">
        <BackIcon onClick={goBack} />
        <div
          className="flex items-center opacity-70"
          onClick={() => {
            navigate("/main")
          }}
        >
          <HomeIcon className="mr-2" />
          <TextStyle>홈으로</TextStyle>
        </div>
      </div>
    </div>
  )
}
