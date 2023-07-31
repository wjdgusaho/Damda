import React, { useState } from "react"
import "../index.css"
import tw from "tailwind-styled-components"
import { styled } from "styled-components"
import { useNavigate } from "react-router"
import { SubHeader } from "./inc/SubHeader"
import "react-datepicker/dist/react-datepicker.css"
import "./datePicker.css"

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
  left: 50%;
  margin-left: -175px;
`

const RadioBtn = styled.label<{ disabled?: boolean }>`
  display: inline-block;
  width: 62px;
  height: 30px;
  border-radius: 30px;
  background-color: rgb(255, 255, 255, 0.38);
  text-align: center;
  line-height: 30px;
  font-size: 18px;
  font-weight: 200;
  cursor: pointer;
  margin-left: 1px;
  margin-right: 1px;
  input[type="radio"]:checked + & {
    background-color: rgb(0, 0, 0, 0.38);
  }
  input[type="checkbox"]:checked + & {
    background-color: rgb(0, 0, 0, 0.38);
  }
`

const SubmitBtn = styled.button`
  width: 130px;
  height: 49px;
  background-color: #f6eef9; // lilac 100
  color: #431f4c; // lilac 950
  border-radius: 30px;
  font-size: 24px;
  box-shadow: 0px 4px 4px #534177;
`

const CancelBtn = styled(SubmitBtn)`
  background-color: rgb(255, 255, 255, 0.05);
`

const BtnWrap = tw.div`
  w-80
  my-16
  flex
  justify-evenly
`

const GoalCapsule = function () {
  let [isHelp, setIsHelp] = useState(false)
  const navigate = useNavigate()
  let [isDisabled, setIsDisabled] = useState(false)
  let [isChecked, setIsChecked] = useState(false)
  let [checkedValue, setCheckedValue] = useState("")

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setCheckedValue(value)
    if (value === "없음") {
      setIsDisabled(!isDisabled)
    }
  }

  return (
    <>
      <SubHeader />
      <Box className="w-80 m-auto">
        <Title>목표 타임캡슐을 만들어요</Title>
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
          <Content>
            달성도
            <span>최대 1000개</span>
          </Content>
        </ContentWrap>
        <InputBox className="w-80" type="number" max={1000} min={1} />

        <ContentWrap>
          <Content>
            카드 작성시간
            <span>카드를 작성할 시간을 설정해요</span>
          </Content>
          <HelpIcon
            onClick={() => setIsHelp(!isHelp)}
            src="assets/icons/questionMark.png"
            alt="helpicon"
          />
        </ContentWrap>
        <div>
          {isHelp ? <Info src="../../helptimeinfo.png" alt="helpinfo" /> : null}
        </div>
        <div className="mt-6">
          <input
            style={{ display: "none" }}
            type="radio"
            id="none"
            name="time"
          />
          <RadioBtn htmlFor="none">없음</RadioBtn>
          <input
            style={{ display: "none" }}
            type="radio"
            id="dawn"
            name="time"
          />
          <RadioBtn htmlFor="dawn">새벽</RadioBtn>
          <input
            style={{ display: "none" }}
            type="radio"
            id="morning"
            name="time"
          />
          <RadioBtn htmlFor="morning">아침</RadioBtn>
          <input
            style={{ display: "none" }}
            type="radio"
            id="afternoon"
            name="time"
          />
          <RadioBtn htmlFor="afternoon">오후</RadioBtn>
          <input
            style={{ display: "none" }}
            type="radio"
            id="night"
            name="time"
          />
          <RadioBtn htmlFor="night">밤</RadioBtn>
        </div>
        <ContentWrap>
          <Content>
            카드 작성요일
            <span style={{ marginLeft: "4px" }}>
              특정 요일에만 카드를 작성하도록 해요
            </span>
          </Content>
        </ContentWrap>
        <div className="mt-6">
          <input
            style={{ display: "none" }}
            type="checkbox"
            id="card_none"
            name="day"
            value="없음"
            onChange={handleOptionChange}
          />
          <RadioBtn htmlFor="card_none">없음</RadioBtn>

          <input
            style={{ display: "none" }}
            type="checkbox"
            id="mon"
            value="mon"
            name="day"
            disabled={isDisabled}
            checked={checkedValue === "mon"}
            onChange={handleOptionChange}
          />
          <RadioBtn htmlFor="mon">월</RadioBtn>

          <input
            style={{ display: "none" }}
            type="checkbox"
            id="tue"
            value="tue"
            name="day"
            disabled={isDisabled}
            checked={checkedValue === "tue"}
            onChange={handleOptionChange}
          />
          <RadioBtn htmlFor="tue">화</RadioBtn>
          <input
            style={{ display: "none" }}
            type="checkbox"
            id="wed"
            name="day"
            disabled={isDisabled}
            onChange={handleOptionChange}
            // checked={isChecked}
          />
          <RadioBtn htmlFor="wed">수</RadioBtn>
          <input
            style={{ display: "none" }}
            type="checkbox"
            id="thu"
            name="day"
            disabled={isDisabled}
            onChange={handleOptionChange}
            // checked={isChecked}
          />
          <RadioBtn htmlFor="thu">목</RadioBtn>
          <input
            style={{ display: "none" }}
            type="checkbox"
            id="fri"
            name="day"
            disabled={isDisabled}
            onChange={handleOptionChange}
            // checked={isChecked}
          />
          <RadioBtn className="mt-1" htmlFor="fri">
            금
          </RadioBtn>
          <input
            style={{ display: "none" }}
            type="checkbox"
            id="sat"
            name="day"
            disabled={isDisabled}
            onChange={handleOptionChange}
            // checked={isChecked}
          />
          <RadioBtn htmlFor="sat">토</RadioBtn>
          <input
            style={{ display: "none" }}
            type="checkbox"
            id="sun"
            name="day"
            disabled={isDisabled}
            onChange={handleOptionChange}
            // checked={isChecked}
          />
          <RadioBtn htmlFor="sun">일</RadioBtn>
        </div>
        <BtnWrap>
          <CancelBtn
            onClick={() => {
              navigate(-1)
            }}
          >
            취소
          </CancelBtn>
          <SubmitBtn>생성</SubmitBtn>
        </BtnWrap>
      </Box>
    </>
  )
}

export default GoalCapsule
