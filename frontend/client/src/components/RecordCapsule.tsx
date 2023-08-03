import React, { useState } from "react"
import "../index.css"
import tw from "tailwind-styled-components"
import { styled } from "styled-components"
import { useNavigate } from "react-router"
import { SubHeader } from "./inc/SubHeader"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import "./datePicker.css"
import { ko } from "date-fns/esm/locale"

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

const SelectBox = styled.select`
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

const RadioBtn = styled.label`
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

const RecordCapsule = function () {
  let [isHelp, setIsHelp] = useState(false)
  const currentDate = new Date()
  const nextDayOfMonth = currentDate.getDate() + 1
  const navigate = useNavigate()
  const oneDayAheadDate = new Date(currentDate)
  const [selectedDate, setSelectedDate] = useState<Date | null>(oneDayAheadDate)

  oneDayAheadDate.setDate(nextDayOfMonth)
  const oneDayAheadDateString = oneDayAheadDate.toISOString().slice(0, 10)

  return (
    <>
      <SubHeader />
      <Box className="w-80 m-auto">
        <Title>기록 타임캡슐을 만들어요</Title>
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
        <DatePicker
          className="datePicker w-80"
          formatWeekDay={(nameOfDay) => nameOfDay.substring(0, 1)}
          dateFormat="yyyy-MM-dd"
          locale={ko}
          minDate={new Date(oneDayAheadDateString)}
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
        />
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
          {isHelp ? <Info src="../../helptimeinfo.png" alt="helpinfo" /> : null}
        </div>
        <div className="mt-6">
          <input
            style={{ display: "none" }}
            type="radio"
            id="none"
            name="time"
            defaultChecked
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
            캡슐 공개위치
            <span>특정 위치에만 열리도록 설정해요</span>
          </Content>
        </ContentWrap>
        <div className="flex justify-between w-80">
          {/* 일단 임시로 이렇게 둠 */}
          <SelectBox className="w-36" name="region" id="region">
            <option value="seoul">서울시</option>
            <option value="gyeonggi">경기도</option>
          </SelectBox>
          <SelectBox className="w-36" name="region" id="region">
            <option>강남구</option>
            <option>강동구</option>
          </SelectBox>
        </div>
        <ContentWrap>
          <Content>
            캡슐 공개날씨
            <span>특정 날씨에만 열리도록 설정해요</span>
          </Content>
        </ContentWrap>
        <div className="w-80 mt-6 flex justify-evenly">
          <input
            style={{ display: "none" }}
            type="radio"
            id="weather_none"
            name="weather"
            defaultChecked
          />
          <RadioBtn htmlFor="weather_none">없음</RadioBtn>
          <input
            style={{ display: "none" }}
            type="radio"
            id="snow"
            name="weather"
          />
          <RadioBtn htmlFor="snow">눈</RadioBtn>
          <input
            style={{ display: "none" }}
            type="radio"
            id="rain"
            name="weather"
          />
          <RadioBtn htmlFor="rain">비</RadioBtn>
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

export default RecordCapsule
