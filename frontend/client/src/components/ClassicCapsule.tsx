import React from "react"
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
`

const Title = tw.div`
    mt-14
    text-xl
    font-extralight
`

const Content = styled.div`
  margin-top: 2.25rem;
  font-size: 1.25rem;
  font-weight: 200;
  /* display: flex;
  align-items: flex-start;
  justify-content: flex-start; */
`

const ContentWrap = tw.div`
    flex
    justify-start
    w-full
`

const ClassicCapsule = function () {
  return (
    <>
      <SubHeader />
      <Box>
        <Title>클래식 타임캡슐을 만들어요</Title>
        <ContentWrap>
          <Content>
            이름
            <span>최대 10자</span>
          </Content>
        </ContentWrap>
      </Box>
    </>
  )
}

export default ClassicCapsule
