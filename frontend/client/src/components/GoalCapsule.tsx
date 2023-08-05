import React, { useState } from "react"
import "../index.css"
import tw from "tailwind-styled-components"
import { styled } from "styled-components"
import { useNavigate } from "react-router"
import { SubHeader } from "./inc/SubHeader"
import "react-datepicker/dist/react-datepicker.css"
import "./datePicker.css"
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

// const RandomWrap = styled.div`
//   position: absolute;
//   top: -40px;
//   left: 190px;
//   display: flex;
//   align-items: center;
// `

// const CustomBtn = styled.div`
//   text-align: center;
//   line-height: 31px;
//   width: 110px;
//   height: 31px;
//   border-radius: 15px;
//   background-color: rgb(255, 255, 255, 0.29);
//   font-weight: 100;
//   margin-left: 20px;
// `

const basicPenalty = [
  "엉덩이로 이름쓰기",
  "스쿼트 10개 하기",
  "카페 음료 돌리기",
  "까나리 액젓 먹기",
  "앞에 나가서 노래부르기",
]

interface DataItem {
  id: number
  title: string
  eng: string
}

const GoalCapsule = function () {
  let [isHelp, setIsHelp] = useState(false)
  // let [isCustom, setIsCustom] = useState(true)
  const navigate = useNavigate()
  const token = useSelector((state: RootState) => state.auth.accessToken)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [timeValue, setTimeValue] = useState<[string, string, string]>([
    "",
    "",
    "",
  ])
  const [isPenalty, setIsPenalty] = useState(false)
  const [penaltyDes, setPenaltyDes] = useState("")
  const [goalNumber, setGoalNumber] = useState("")

  const data: DataItem[] = [
    { id: 0, title: "없음", eng: "" },
    { id: 1, title: "월", eng: "Monday" },
    { id: 2, title: "화", eng: "Tuesday" },
    { id: 3, title: "수", eng: "Wednesday" },
    { id: 4, title: "목", eng: "Thursday" },
    { id: 5, title: "금", eng: "Friday" },
    { id: 6, title: "토", eng: "Saturday" },
    { id: 7, title: "일", eng: "Sunday" },
  ]

  // 체크된 아이템을 담을 배열
  const [checkItems, setCheckItems] = useState<number[]>([0])

  const handleCheckboxChange = (id: number) => {
    if (id === 0) {
      setCheckItems([0])
    } else {
      // 없음이 선택됐을 때, checkItem 배열안에 item이 있다면 비우기
      const updatedCheckItems = checkItems.filter((item) => item !== 0)

      // 토글
      if (updatedCheckItems.includes(id)) {
        setCheckItems(updatedCheckItems.filter((item) => item !== id))
      } else {
        setCheckItems([...updatedCheckItems, id])
      }
    }
  }

  // 랜덤 벌칙
  // const [selectedPenalty, setSelectedPenalty] = useState<string>("")

  // const handleButtonClick = () => {
  //   const randomIndex = Math.floor(Math.random() * basicPenalty.length)
  //   setSelectedPenalty(basicPenalty[randomIndex])
  // }

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value

    if (value === "") {
      e.currentTarget.value = ""
    } else {
      let parsedValue = parseInt(value, 10)

      // 최소값과 최대값 사이로 조정
      if (parsedValue < 1) {
        parsedValue = 1
      } else if (parsedValue > 1000) {
        parsedValue = 1000
      }

      // 숫자가 아닌 입력을 처리
      if (isNaN(parsedValue)) {
        e.currentTarget.value = "1"
      } else {
        // 값 적용
        e.currentTarget.value = parsedValue.toString()
      }
    }
  }

  function inputTitle(e: React.FormEvent<HTMLInputElement>) {
    setTitle(e.currentTarget.value)
  }

  function inputDescription(e: React.FormEvent<HTMLInputElement>) {
    setDescription(e.currentTarget.value)
  }

  function inputPenalty(e: React.FormEvent<HTMLInputElement>) {
    setIsPenalty(true)
    setPenaltyDes(e.currentTarget.value)
  }

  function inputGoalNumber(e: React.FormEvent<HTMLInputElement>) {
    setGoalNumber(e.currentTarget.value)
  }

  function handleTimeChange(value: [string, string, string]) {
    setTimeValue(value)
  }

  function FormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const inputDay = data
      .filter((item) => checkItems.includes(item.id))
      .map((item) => item.eng)

    axios({
      method: "POST",
      url: serverUrl + "timecapsule/create",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      data: {
        title: title,
        type: "GOAL",
        description: description,
        goalCard: goalNumber,
        openDate: null,
        criteria: {
          type: "CARD",
          localBig: null,
          localMedium: null,
          weatherStatus: null,
          startTime: timeValue[0],
          endTime: timeValue[1],
          timeKr: timeValue[2],
        },
        cardInputDay: inputDay,
        penalty: {
          penalty: isPenalty,
          penaltyDescription: penaltyDes,
        },
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
        <Title>목표 타임캡슐을 만들어요</Title>
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
            <Content>
              달성도
              <span>최대 1000개</span>
            </Content>
          </ContentWrap>
          <InputBox
            onChange={inputGoalNumber}
            className="w-80"
            type="number"
            max={1000}
            min={1}
            onInput={handleInput}
          />

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
          <ContentWrap>
            <Content>
              카드 작성요일
              <span style={{ marginLeft: "4px" }}>
                특정 요일에만 카드를 작성하도록 해요
              </span>
            </Content>
          </ContentWrap>
          <div className="mt-6">
            {data.map((item) => (
              <React.Fragment key={item.id}>
                <input
                  type="checkbox"
                  style={{ display: "none" }}
                  id={`day_${item.id}`}
                  name="day"
                  value={item.title}
                  onChange={() => {
                    handleCheckboxChange(item.id)
                  }}
                  checked={checkItems.includes(item.id)}
                />
                <RadioBtn className="my-1" htmlFor={`day_${item.id}`}>
                  {item.title}
                </RadioBtn>
              </React.Fragment>
            ))}
          </div>
          <ContentWrap>
            <Content>벌칙</Content>
          </ContentWrap>
          <InputBox
            onChange={inputPenalty}
            className="w-80"
            type="text"
            maxLength={30}
          />
          {/* <PenaltyInputBox
            onChange={inputPenaty}
            className="w-80"
            type="text"
            placeholder="랜덤 벌칙 정하기"
            disabled={isCustom}
            maxLength={30}
            value={selectedPenalty}
          />
          <div style={{ position: "relative", width: "24px", height: "24px" }}>
            <RandomWrap>
              <img
                onClick={handleButtonClick}
                style={{ width: "18px", height: "18px" }}
                src="assets/icons/random.png"
                alt="random"
              />
              <CustomBtn
                onClick={() => {
                  setIsCustom(false)
                  setSelectedPenalty("")
                }}
              >
                직접입력
              </CustomBtn>
            </RandomWrap>
          </div> */}
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

// 랜덤 벌칙 정하기
// interface InputBoxProps {
//   className?: string
//   type?: string
//   placeholder?: string
//   disabled?: boolean
//   maxLength?: number
//   value: string | null
// }

// const PenaltyInputBox = styled(InputBox)<InputBoxProps>``

export default GoalCapsule
