import React, { useState } from "react"
import { styled } from "styled-components"

const Card = function () {
  const [inputValue, setInputValue] = useState("")
  const [bgcolor, setBgcolor] = useState("#C4C5F4")
  const [font, setFont] = useState("pretendard")

  const handleChange = (e: { target: { value: any } }) => {
    const value = e.target.value
    setInputValue(value)
  }
  const bgColorChange = (color: string) => {
    const value = color
    setBgcolor(value)
  }

  const handleFontChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedFont = event.target.value
    setFont(selectedFont)
  }

  const bgColorList = [
    "white",
    "#C1C1C1",
    "#FFCACA",
    "#FED5B9",
    "#FDF5DD",
    "#CAE8E5",
    "#CBEAEF",
    "#C4C5F4",
    "#DDCFFC",
    "#FFDBED",
  ]

  const inputWidth =
    inputValue.length <= 5 ? "100px" : `${inputValue.length * 10 + 100}px`

  return (
    <BackGround bgColor={bgcolor}>
      <div className="m-auto pt-6 h-14 flex w-72 justify-between">
        <img src="/assets/icons/button_x.png" alt="X" />
        <img src="/assets/icons/button_check.png" alt="체크" />
      </div>
      <CardContainer className="mt-6 m-auto overflow-hidden">
        <div className="flex justify-between p-2 text-sm">
          <div className="flex">
            <img
              className="w-8 mr-1"
              src="/assets/icons/profile_1.png"
              alt="프로필사진"
            />
            <span className="mt-1 font-light text-neutral-500">
              <Text font={font}>달토끼맛 쿠키</Text>
            </span>
          </div>
          <div className="font-light text-neutral-500">
            <Text font={font}>2023.02.03</Text>
          </div>
        </div>
        <div className="text-center -mt-2">
          <Title
            className="w-fit bg-white bg-opacity-0 text-center"
            type="text"
            value={inputValue}
            onChange={handleChange}
            placeholder={inputValue ? "" : "오늘의 제목"}
            width={inputWidth}
            font={font}
          />
          <TitleBG width={inputWidth} className="m-auto"></TitleBG>
        </div>
        <div className="w-40 h-40 m-auto mt-4 bg-white bg-opacity-25">
          <img src="/assets/Astronaut-4.png" alt="사진" />
        </div>
        <div className="text-center">
          <Content
            className="bg-white bg-opacity-0 !text-xs mt-2"
            placeholder="어떤 일을 기록하고 싶으신가요?"
            rows={5}
            maxLength={150}
            font={font}
          ></Content>
        </div>
      </CardContainer>
      <div className="flex justify-between p-2 w-80 m-auto">
        {bgColorList.map((color) => (
          <ColorPicker
            color={color}
            onClick={() => bgColorChange(color)}
          ></ColorPicker>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-center">
        <FontSelect font={font} name="font" id="" onChange={handleFontChange}>
          <Option font="pretendard" value="pretendard">
            pretendard
          </Option>
          <Option font="PyeongChangPeaceBold" value="PyeongChangPeaceBold">
            평창평화체
          </Option>
          <Option font="PyeongChangPeace" value="PyeongChangPeace">
            평창평화체2
          </Option>
        </FontSelect>
      </div>
    </BackGround>
  )
}

interface BackGroundProps {
  bgColor: string
}

const BackGround = styled.div<BackGroundProps>`
  background-color: ${(props) => props.bgColor};
  width: 100vw;
  height: 100vh;
`

const CardContainer = styled.div`
  border: 1px solid #545454;
  width: 90vw;
  height: 90vw;
`

interface TitleProps {
  width: string
  color?: string
  font?: string
}

const Title = styled.input<TitleProps>`
  color: #00000089;
  width: ${(props) => props.width};
  outline: none;
  font-family: ${(props) => props.font};
  font-weight: 700;
  font-size: 15px;

  &::placeholder {
    color: #80808081;
  }
`
const TitleBG = styled.div<TitleProps>`
  width: ${(props) => props.width};
  background-color: #ffffff7c;
  height: 7px;
  margin-top: -15px;
`
interface ContentProps {
  font?: string
}
const Content = styled.textarea<ContentProps>`
  color: #00000099;
  outline: none;
  font-family: ${(props) => props.font};
  font-weight: 300;
  font-size: 10px;
  text-align: center;
  width: 80%;
  height: 100px;
  resize: none;
  &::placeholder {
    color: #00000057;
  }
`

interface ColorProps {
  color?: string
}
const ColorPicker = styled.div<ColorProps>`
  width: 25px;
  height: 25px;
  background-color: ${(props) => props.color};
  border-radius: 20px;
  border: 1px solid #545454;
`

interface FontProps {
  font?: string
}

const FontSelect = styled.select<FontProps>`
  width: 70%;
  padding: 3px;
  font-family: ${(props) => props.font};
  background: url("assets/icons/selectArrow.png") no-repeat 95% 50%;
  background-size: 13px;
  border-radius: 0px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border-bottom: 2px solid #545454;
  outline: none;
`

const Option = styled.option<FontProps>`
  background-color: ${(props) => (props.selected ? "#FFCACA" : "white")};
  color: ${(props) => (props.selected ? "white" : "#545454")};
  font-family: ${(props) => props.font};
`

const Text = styled.div<FontProps>`
  font-family: ${(props) => props.font};
`

export default Card
