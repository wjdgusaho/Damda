import React, { useEffect, useState } from "react"
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
import { useSelector } from "react-redux"
import { RootState } from "../store/Store"

const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${(props) => props.theme.colorCommon};
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
    opacity: 0.47;
    font-size: 14px;
    color: ${(props) => props.theme.colorCommon};
    margin-left: 15px;
  }
`

const InputBox = styled.input`
  background-color: rgb(255, 255, 255, 0);
  border-bottom: 2px solid ${(props) => props.theme.colorCommon};
  height: 50px;
  outline: none;
  font-weight: 200;
`

const SelectBox = styled.select`
  background-color: rgb(255, 255, 255, 0);
  height: 50px;
  outline: none;
  font-weight: 200;

  option {
    color: black;
  }
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
  background-color: ${(props) => props.theme.color100};
  color: ${(props) => props.theme.color900};
  border-radius: 30px;
  font-size: 24px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.5);
`

const CancelBtn = styled(SubmitBtn)`
  background-color: rgb(255, 255, 255, 0.15);
`

const BtnWrap = tw.div`
  w-80
  my-16
  flex
  justify-evenly
`

const DatePickerWrap = styled.div`
  border-bottom: 2px solid ${(props) => props.theme.colorCommon};
`

const RecordCapsule = function () {
  const token = useSelector((state: RootState) => state.auth.accessToken)
  let [isHelp, setIsHelp] = useState(false)
  const currentDate = new Date()
  const nextDayOfMonth = currentDate.getDate() + 2
  const navigate = useNavigate()
  const twoDayAheadDate = new Date(currentDate)
  const [selectedDate, setSelectedDate] = useState<Date | null>(twoDayAheadDate)
  const [locationBig, setLocationBig] = useState<string[]>(["없음"])
  const [selectedLocationBig, setSelectedLocationBig] = useState<string>("")
  const [locationMedium, setLocationMedium] = useState<string[]>([])
  const [selectedLocationMedium, setSelectedLocationMedium] =
    useState<string>("")
  const [weatherValue, setWeatherValue] = useState<string>("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [timeValue, setTimeValue] = useState<[string, string, string]>([
    "",
    "",
    "",
  ])

  twoDayAheadDate.setDate(nextDayOfMonth)
  const twoDayAheadDateString = twoDayAheadDate.toISOString().slice(0, 10)

  function inputTitle(e: React.FormEvent<HTMLInputElement>) {
    setTitle(e.currentTarget.value)
  }

  function inputDescription(e: React.FormEvent<HTMLInputElement>) {
    setDescription(e.currentTarget.value)
  }

  function handleDatePickerKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    e.preventDefault()
  }

  function handleWeatherChange(value: string) {
    setWeatherValue(value)
  }

  function handleTimeChange(value: [string, string, string]) {
    setTimeValue(value)
  }

  const handleLocationBigChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value

    if (newValue === "없음") {
      setSelectedLocationBig("")
      setSelectedLocationMedium("")
    } else {
      setSelectedLocationBig(newValue)
      fetchLocationMediumData()
    }
  }

  const handleLocationMediumChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newValue = e.target.value

    setSelectedLocationMedium(newValue)
    fetchLocationMediumData()
  }

  useEffect(() => {
    setLocationMedium([])
    fetchLocationMediumData()
  }, [selectedLocationBig])

  const fetchLocationMediumData = async () => {
    if (selectedLocationBig !== "없음") {
      try {
        const response = await axios({
          method: "GET",
          url:
            process.env.REACT_APP_SERVER_URL +
            `location/medium?bigLocation=${selectedLocationBig}`,
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        })
        setLocationMedium(response.data)
      } catch (error) {
        console.log("데이터 가져오기 오류:", error)
      }
    }
  }

  useEffect(() => {
    const fetchLocationBigData = async () => {
      try {
        const response = await axios({
          method: "GET",
          url: process.env.REACT_APP_SERVER_URL + "location/big",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        })
        console.log(response.data)
        setLocationBig([
          ...locationBig,
          response.data[10],
          response.data[6],
          response.data[15],
          response.data[1],
          response.data[9],
          response.data[5],
          response.data[0],
          response.data[2],
          response.data[4],
          response.data[16],
          response.data[11],
          response.data[12],
          response.data[14],
          response.data[8],
          response.data[7],
          response.data[3],
          response.data[13],
        ])
      } catch (error) {
        console.log("Error fetching data:", error)
      }
    }

    fetchLocationBigData()
  }, [])

  function FormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!title) {
      alert("타임캡슐 이름을 입력해주세요.")
    } else if (!description) {
      alert("한줄설명을 입력해주세요.")
    } else {
      axios({
        method: "POST",
        url: process.env.REACT_APP_SERVER_URL + "timecapsule/create",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        data: {
          title: title,
          type: "RECORD",
          description: description,
          goalCard: 0,
          openDate: selectedDate,
          criteria: {
            type: "OPEN",
            localBig: selectedLocationBig,
            localMedium: selectedLocationMedium || locationMedium[0],
            weatherStatus: weatherValue,
            startTime: timeValue[0],
            endTime: timeValue[1],
            timeKr: timeValue[2],
          },
          cardInputDay: null,
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
  }

  return (
    <>
      <SubHeader />
      <Box className="w-80 m-auto">
        <Title>기록 타임캡슐을 만들어요</Title>
        <form onSubmit={FormSubmit}>
          <ContentWrap>
            <Content>
              이름
              <span>최대 15자</span>
            </Content>
          </ContentWrap>
          <InputBox
            onChange={inputTitle}
            className="w-80"
            type="text"
            maxLength={15}
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
          <DatePickerWrap>
            <DatePicker
              className="datePicker w-80"
              formatWeekDay={(nameOfDay) => nameOfDay.substring(0, 1)}
              dateFormat="yyyy-MM-dd"
              locale={ko}
              minDate={new Date(twoDayAheadDateString)}
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              onKeyDown={handleDatePickerKeyDown}
            />
          </DatePickerWrap>
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
          <ContentWrap>
            <Content>
              캡슐 공개위치
              <span>특정 위치에만 열리도록 설정해요</span>
            </Content>
          </ContentWrap>
          <div className="flex justify-between w-80">
            <DatePickerWrap>
              <SelectBox
                className="w-36"
                name="locationBig"
                id="locationBig"
                onChange={handleLocationBigChange}
              >
                {locationBig.map((location, index) => (
                  <option key={index} value={location}>
                    {location}
                  </option>
                ))}
              </SelectBox>
            </DatePickerWrap>

            <DatePickerWrap>
              <SelectBox
                className="w-36"
                name="locationMedium"
                id="locationMedium"
                onChange={handleLocationMediumChange}
              >
                {locationMedium.map((location, index) => (
                  <option key={index} value={location}>
                    {location}
                  </option>
                ))}
              </SelectBox>
            </DatePickerWrap>
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
              onChange={() => handleWeatherChange("")}
            />
            <RadioBtn htmlFor="weather_none">없음</RadioBtn>
            <input
              style={{ display: "none" }}
              type="radio"
              id="snow"
              name="weather"
              onChange={() => handleWeatherChange("SNOW")}
            />
            <RadioBtn htmlFor="snow">눈</RadioBtn>
            <input
              style={{ display: "none" }}
              type="radio"
              id="rain"
              name="weather"
              onChange={() => handleWeatherChange("RAIN")}
            />
            <RadioBtn htmlFor="rain">비</RadioBtn>
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

export default RecordCapsule
