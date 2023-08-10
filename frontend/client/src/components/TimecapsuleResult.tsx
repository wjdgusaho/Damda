import React, { useEffect, useMemo, useState } from "react"
import "../index.css"
import tw from "tailwind-styled-components"
import { styled } from "styled-components"
import { useNavigate, useParams } from "react-router"
import { SubHeader } from "./inc/SubHeader"
import axios from "axios"
import { serverUrl } from "../urls"
import { useSelector } from "react-redux"
import { RootState } from "../store/Store"
import "./datePicker.css"
import Modal from "react-modal"

const Box = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  justify-content: start;
  align-items: center;
  margin: auto;
  width: 20rem;
  background-color: ${(props) => props.theme.color50};
  border-radius: 50px;
  font-family: "Pretendard";
  margin-top: 150px;
  box-shadow: 0px 4px 4px 4px rgb(0, 0, 0, 0.25);
  color: ${(props) => props.theme.color900};
  min-height: 656px;
  padding: 0px 15px;
`

const Title = styled.div`
  z-index: 1;
  position: absolute;
  top: 0px;
`

const HightLight = styled.div`
  position: absolute;
  width: calc(100% + 10px);
  height: 13px;
  background-color: ${(props) => props.theme.color200};
  top: 18px;
  margin-left: -5px;
`

// const CapsuleImg = styled.div<{ capsuleIcon: string }>`
//   position: absolute;
//   top: -102px;
//   background-image: url(/${(props) => props.theme[props.capsuleIcon]});
//   background-repeat: no-repeat;
//   background-size: cover;
//   width: 204px;
//   height: 204px;
//   filter: drop-shadow(0px 4px 4px rgb(0, 0, 0, 0.4));
// `

// 나중에 위에껄로 쓰면 됨
const CapsuleImg = styled.div`
  position: absolute;
  top: -102px;
  background-repeat: no-repeat;
  background-size: cover;
  width: 204px;
  height: 204px;
  filter: drop-shadow(0px 4px 4px rgb(0, 0, 0, 0.4));
`

const BackBtn = styled.div`
  color: ${(props) => props.theme.color950};
  font-size: 16px;
`

const TimecapsuleResult = function () {
  const { capsuleId } = useParams()
  const token = useSelector((state: RootState) => state.auth.accessToken)
  const navigate = useNavigate()

  return (
    <>
      <Box>
        <CapsuleImg>
          <img src="../../assets/universe/Planet-9.png" alt="dummyimg" />
        </CapsuleImg>
        <>
          <Title className="text-2xl font-bold mb-1 mt-28">더미 데이터</Title>
          <div className="text-2xl font-bold relative mb-1 mt-28">
            <div className="invisible">더미 데이터</div>
            <HightLight />
          </div>
          <div style={{ fontSize: "14px", textAlign: "center" }}>
            상세내용 아이스 바닐라 라떼
          </div>
          <div>이제 여기만 갈아끼우면 됩니다</div>
          <BackBtn
            onClick={() => {
              navigate(-1)
            }}
            className="my-5"
          >
            돌아가기
          </BackBtn>
        </>
      </Box>
    </>
  )
}

export default TimecapsuleResult
