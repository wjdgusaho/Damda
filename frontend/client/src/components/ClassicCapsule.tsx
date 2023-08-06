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
import axios from "axios"
import { serverUrl } from "../urls"
import { useSelector } from "react-redux"
import { RootState } from "../store/Store"

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

const ClassicCapsule = function () {
  const [isHelp, setIsHelp] = useState(false)
  const currentDate = new Date()
  const oneDayAheadDate = new Date(currentDate)
  const nextDayOfMonth = currentDate.getDate() + 1
  const navigate = useNavigate()
  const token = useSelector((state: RootState) => state.auth.accessToken)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | null>(oneDayAheadDate)
  const [timeValue, setTimeValue] = useState<[string, string, string]>([
    "",
    "",
    "",
  ])

  oneDayAheadDate.setDate(nextDayOfMonth)
  const oneDayAheadDateString = oneDayAheadDate.toISOString().slice(0, 10)

  function inputTitle(e: React.FormEvent<HTMLInputElement>) {
    setTitle(e.currentTarget.value)
  }

  function inputDescription(e: React.FormEvent<HTMLInputElement>) {
    setDescription(e.currentTarget.value)
  }

  function handleTimeChange(value: [string, string, string]) {
    setTimeValue(value)
  }

  function handleDatePickerKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    e.preventDefault()
  }

  function FormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    axios({
      method: "POST",
      url: serverUrl + "timecapsule/create",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      data: {
        title: title,
        type: "CLASSIC",
        description: description,
        goalCard: 0,
        openDate: selectedDate,
        criteria: {
          type: "OPEN",
          localBig: null,
          localMedium: null,
          weatherStatus: null,
          startTime: timeValue[0],
          endTime: timeValue[1],
          timeKr: timeValue[2],
        },
        cardInputDay: [],
        penalty: null,
      },
    })
      .then((res) => {
        if (res.data.code === 200) {
          console.log(res.data)
          navigate(`/timecapsule/detail/${res.data.data.timecapsuleNo}`)
        } else if (res.data.code === -4004) {
          alert(
            "보유 가능 타임캡슐 수가 최대입니다! 최대 보유 수량를 늘리려면 상점에서 구매하실 수 있습니다." // 일단 이렇게, 나중에 수정할거임
          )
          navigate("/main")
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }
  return (
    <>
      <SubHeader />
      <Box className="w-80 m-auto">
        <Title>클래식 타임캡슐을 만들어요</Title>
        <form onSubmit={FormSubmit}>
          <ContentWrap>
            <Content>
              이름
              <span>최대 10자</span>
            </Content>
          </ContentWrap>
          <InputBox
            onChange={inputTitle}
            className="w-80"
            type="text"
            maxLength={10}
          />
          <ContentWrap>
            <Content>
              한줄설명
              <span>최대 30자</span>
            </Content>
          </ContentWrap>
          <InputBox
            onChange={inputDescription}
            className="w-80"
            type="text"
            maxLength={30}
          />
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
            onKeyDown={handleDatePickerKeyDown}
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
            {isHelp ? (
              <Info src="../../helptimeinfo.png" alt="helpinfo" />
            ) : null}
          </div>
          <div className="mt-6">
            <input
              style={{ display: "none" }}
              type="radio"
              id="none"
              name="time"
              onChange={() => handleTimeChange(["", "", ""])}
              defaultChecked
            />
            <RadioBtn htmlFor="none">없음</RadioBtn>
            <input
              style={{ display: "none" }}
              type="radio"
              id="dawn"
              name="time"
              onChange={() => handleTimeChange(["00", "06", "새벽"])}
            />
            <RadioBtn htmlFor="dawn">새벽</RadioBtn>
            <input
              style={{ display: "none" }}
              type="radio"
              id="morning"
              name="time"
              onChange={() => handleTimeChange(["06", "12", "아침"])}
            />
            <RadioBtn htmlFor="morning">아침</RadioBtn>
            <input
              style={{ display: "none" }}
              type="radio"
              id="afternoon"
              name="time"
              onChange={() => handleTimeChange(["12", "18", "오후"])}
            />
            <RadioBtn htmlFor="afternoon">오후</RadioBtn>
            <input
              style={{ display: "none" }}
              type="radio"
              id="night"
              name="time"
              onChange={() => handleTimeChange(["18", "24", "밤"])}
            />
            <RadioBtn htmlFor="night">밤</RadioBtn>
          </div>
          <BtnWrap>
            <CancelBtn
              type="button"
              onClick={() => {
                navigate(-1)
              }}
            >
              취소
            </CancelBtn>
            <SubmitBtn type="submit">생성</SubmitBtn>
          </BtnWrap>
        </form>
      </Box>
    </>
  )
}

export default ClassicCapsule
