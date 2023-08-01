import React, { useState } from "react"
import "../index.css"
import tw from "tailwind-styled-components"
import { styled } from "styled-components"
import { useNavigate } from "react-router"
import { SubHeader } from "./inc/SubHeader"

const Background = styled.div`
  background-image: url("../../Background.png");
  background-size: 540px;
  background-position-x: center;
  background-position-y: 60px;
  background-repeat: no-repeat;
  width: 100%;
  height: 100vh;
  position: relative;
`

const TypeBtn = styled.button`
  background-color: rgba(255, 255, 255, 0.3);
  width: 297px;
  height: 70px;
  font-size: 20px;
  border-radius: 15px;
  color: #fff;
  font-weight: 100;
  margin-bottom: 55px;
  box-shadow: 0px 4px 4px rgb(33, 25, 74, 0.4);
  z-index: 1;
`

const HeaderWrap = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`

const Box = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #e4e6f5;
  font-family: "Pretendard";
  font-size: 20px;
`

const HelpIcon = styled.img`
  width: 36px;
  height: 36px;
  cursor: pointer;
  z-index: 1;
`

interface HelpProps {
  isHelp: boolean
  setIsHelp: React.Dispatch<React.SetStateAction<boolean>>
}

const SelectType = function () {
  let [isHelp, setIsHelp] = useState(false)
  const navigate = useNavigate()

  return (
    <>
      {isHelp ? <Help isHelp={isHelp} setIsHelp={setIsHelp} /> : null}
      <Background className={isHelp ? "blur-sm" : ""}>
        <HeaderWrap>
          <SubHeader />
        </HeaderWrap>
        <Box>
          <div className="flex">
            <div className="mb-5 ml-9">어떤 타임캡슐을 만들어 볼까요?</div>
            <HelpIcon
              onClick={() => setIsHelp(!isHelp)}
              className="mt-12 mb-8"
              src="../../assets/icons/questionMark.png"
              alt="questionMark"
            />
          </div>
          <TypeBtn
            onClick={() => {
              navigate("/classic")
            }}
          >
            클래식 타임캡슐
          </TypeBtn>
          <TypeBtn
            onClick={() => {
              navigate("/record")
            }}
          >
            기록 타임캡슐
          </TypeBtn>
          <TypeBtn
            onClick={() => {
              navigate("/goal")
            }}
          >
            목표 타임캡슐
          </TypeBtn>
        </Box>
      </Background>
    </>
  )
}

const BlurBg = styled.div`
  height: 100vh;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgb(9, 6, 52, 0.57);
  z-index: 2;
  display: flex;
  flex-direction: column;
  color: white;
  justify-content: center;
  align-items: center;
`

const CancelBtn = styled.img`
  width: 16px;
  height: 16px;
  position: absolute;
  top: 5%;
  right: 10%;
`

const HelpTitle = styled.div`
  font-family: "Pretendard";
  font-size: 20px;
`

const HelpContent = styled.div`
  font-family: "Pretendard";
  font-size: 17px;
  font-weight: 100;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 40px;
`

function Help({ isHelp, setIsHelp }: HelpProps) {
  return (
    <BlurBg>
      <CancelBtn
        onClick={() => {
          setIsHelp(!isHelp)
        }}
        src="/assets/icons/cancel.png"
        alt="cancel"
      />
      <HelpTitle style={{ marginTop: "10%" }}>공통사항</HelpTitle>
      <HelpContent>
        타임 캡슐 오픈 조건을 설정할 수 있고
        <br />
        조건을 달성한 인원만 타임캡슐을 열 수 있어요!
        <br />
        캡슐이 닫히면 삭제 및 수정이 불가능 합니다
      </HelpContent>
      <HelpTitle>클래식 타임캡슐</HelpTitle>
      <HelpContent>
        생성 후 24시간이 지나면 캡슐이 닫혀요
        <br />
        타임캡슐이 닫히기 전에 추억을 저장해 보아요!
      </HelpContent>
      <HelpTitle>기록 타임캡슐</HelpTitle>
      <HelpContent>
        매일 한장씩 타임캡슐에 카드를 넣어보세요!
        <br />( 00 시 기준으로 카드 작성이 초기화 됩니다 )
      </HelpContent>
      <HelpTitle>목표 타임캡슐</HelpTitle>
      <HelpContent>
        달성도가 가득 채워져야 열리는 타임캡슐이에요
        <br />
        카드 작성 조건을 설정할 수 있어요
        <br />
        목표 달성 후 그래프로 <br /> 참가자별 기여도를 확인해 보세요!
        <br />
        꼴지에겐 벌칙을~!
      </HelpContent>
    </BlurBg>
  )
}

export default SelectType
