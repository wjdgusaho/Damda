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

const RandomWrap = styled.div`
  position: absolute;
  top: -40px;
  right: -145px;
  display: flex;
  align-items: center;
`

const CustomBtn = styled.button`
  width: 90px;
  height: 31px;
  border-radius: 15px;
  background-color: rgb(255, 255, 255, 0.29);
  font-weight: 100;
  margin-left: 20px;
`

const penalty = [
  "엉덩이로 이름쓰기",
  "스쿼트 10개 하기",
  "카페 음료 돌리기",
  "까나리 액젓 먹기",
  "앞에 나가서 노래부르기",
]

interface DataItem {
  id: number
  title: string
}

const GoalCapsule = function () {
  let [isHelp, setIsHelp] = useState(false)
  let [isCustom, setIsCustom] = useState(true)
  const navigate = useNavigate()

  const data: DataItem[] = [
    { id: 0, title: "없음" },
    { id: 1, title: "월" },
    { id: 2, title: "화" },
    { id: 3, title: "수" },
    { id: 4, title: "목" },
    { id: 5, title: "금" },
    { id: 6, title: "토" },
    { id: 7, title: "일" },
  ]

  // 체크된 아이템을 담을 배열
  const [checkItems, setCheckItems] = useState<number[]>([])

  const handleCheckboxChange = (id: number) => {
    if (id === 0) {
      setCheckItems([0])
    } else {
      // If "없음" is not selected, remove it from checkItems if present
      const updatedCheckItems = checkItems.filter((item) => item !== 0)

      // Toggle other checkboxes on/off
      if (updatedCheckItems.includes(id)) {
        setCheckItems(updatedCheckItems.filter((item) => item !== id))
      } else {
        setCheckItems([...updatedCheckItems, id])
      }
    }
  }

  // 랜덤 벌칙
  const [selectedPenalty, setSelectedPenalty] = useState<string | null>(null)

  const handleButtonClick = () => {
    const randomIndex = Math.floor(Math.random() * penalty.length)
    setSelectedPenalty(penalty[randomIndex])
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
          {data.map((item) => (
            <React.Fragment key={item.id}>
              <input
                type="checkbox"
                style={{ display: "none" }}
                id={`day_${item.id}`}
                name="day"
                value={item.title}
                onChange={() => handleCheckboxChange(item.id)}
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
        <PenaltyInputBox
          className="w-80"
          type="text"
          placeholder="랜덤 벌칙 정하기"
          disabled={isCustom}
          maxLength={30}
          defaultValue={selectedPenalty !== null ? selectedPenalty : ""}
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
                setSelectedPenalty(null)
              }}
            >
              직접입력
            </CustomBtn>
          </RandomWrap>
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

// 랜덤 벌칙 정하기
interface InputBoxProps {
  className?: string
  type?: string
  placeholder?: string
  disabled?: boolean
  maxLength?: number
  defaultValue: string | null
}

const PenaltyInputBox = styled(InputBox)<InputBoxProps>``

export default GoalCapsule
