import React, { useState } from "react"
import "../index.css"
import tw from "tailwind-styled-components"
import { styled } from "styled-components"
import { useNavigate } from "react-router"
import { SubHeader } from "./inc/SubHeader"

const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  font-family: "Pretendard";
  justify-content: center;
`

const Title = tw.div`
    mt-14
    text-xl
    font-light
`

const Content = styled.div`
  margin-top: 2.25rem;
  font-size: 1.25rem;
  font-weight: 300;
  span {
    font-size: 14px;
    color: rgb(243, 245, 251, 0.47);
    margin-left: 15px;
  }
`

const InputBox = styled.input`
  background-color: rgb(255, 255, 255, 0);
  border-bottom: 2px solid rgb(255, 255, 255, 0.83);
  height: 50px;
  outline: none;
  font-weight: 200;
`

const ContentWrap = tw.div`
    flex
    justify-start
    w-full
`

const HelpIcon = styled.img`
  width: 24px;
  height: 24px;
  margin: auto;
  margin-bottom: 3px;
`

const Info = styled.img`
  position: absolute;
  width: 353px;
  right: 180px;
`

const ClassicCapsule = function () {
  let [isHelp, setIsHelp] = useState(false)
  return (
    <>
      <SubHeader />
      <Box className="w-80 m-auto">
        <Title>클래식 타임캡슐을 만들어요</Title>
        <ContentWrap>
          <Content>
            이름
            <span>최대 10자</span>
          </Content>
        </ContentWrap>
        <InputBox className="w-80" type="text" maxLength={10} />
        <ContentWrap>
          <Content>
            한줄설명
            <span>최대 30자</span>
          </Content>
        </ContentWrap>
        <InputBox className="w-80" type="text" maxLength={30} />
        <ContentWrap>
          <Content>캡슐 공개일</Content>
        </ContentWrap>
        <InputBox className="w-80" type="date" name="date" id="date" />
        <ContentWrap>
          <Content>
            캡슐 공개시간
            <span>캡슐이 열릴 시간대를 설정해요</span>
          </Content>
          <HelpIcon
            onClick={() => setIsHelp(!isHelp)}
            src="assets/icons/questionMark.png"
            alt="helpicon"
          />
        </ContentWrap>
        <div>
          {isHelp ? <Info src="../../helptimeinfo.png" alt="" /> : null}
        </div>
        <div>
          <label>
            <input type="radio" name="time" />
            <span>새벽</span>
          </label>
          <label>
            <input type="radio" name="time" />
            <span>아침</span>
          </label>
          <label>
            <input type="radio" name="time" />
            <span>오후</span>
          </label>
          <label>
            <input type="radio" name="time" />
            <span>밤</span>
          </label>
        </div>
      </Box>
    </>
  )
}

export default ClassicCapsule
