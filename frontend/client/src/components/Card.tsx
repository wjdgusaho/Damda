import React, { useState } from "react"
import { styled } from "styled-components"

interface StickerType {
  no: number
  name: string
  icon: string
  sticker: {
    s1?: string
    s2?: string
    s3?: string
    s4?: string
    s5?: string
    s6?: string
    s7?: string
    s8?: string
    s9?: string
    s10?: string
    s11?: string
    s12?: string
  }
}

const stickerList: StickerType[] = [
  {
    no: 1,
    name: "confetti",
    icon: "assets/stickers/confetti/icon.png",
    sticker: {
      s1: "assets/stickers/confetti/1.png",
      s2: "assets/stickers/confetti/2.png",
      s3: "assets/stickers/confetti/3.png",
      s4: "assets/stickers/confetti/4.png",
      s5: "assets/stickers/confetti/5.png",
      s6: "assets/stickers/confetti/6.png",
      s7: "assets/stickers/confetti/7.png",
      s8: "assets/stickers/confetti/8.png",
      s9: "assets/stickers/confetti/9.png",
      s10: "assets/stickers/confetti/10.png",
    },
  },
  {
    no: 2,
    name: "colorface",
    icon: "assets/stickers/colorface/icon.png",
    sticker: {
      s1: "assets/stickers/colorface/1.png",
      s2: "assets/stickers/colorface/2.png",
      s3: "assets/stickers/colorface/3.png",
      s4: "assets/stickers/colorface/4.png",
      s5: "assets/stickers/colorface/5.png",
      s6: "assets/stickers/colorface/6.png",
      s7: "assets/stickers/colorface/7.png",
      s8: "assets/stickers/colorface/8.png",
      s9: "assets/stickers/colorface/9.png",
      s10: "assets/stickers/colorface/10.png",
      s11: "assets/stickers/colorface/11.png",
    },
  },
]

const Card = function () {
  const [inputValue, setInputValue] = useState("")
  const [bgcolor, setBgcolor] = useState("#C4C5F4")
  const [font, setFont] = useState("pretendard")
  const [stickerNo, setSticker] = useState(stickerList[0].no)

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
  const selectSticker = (no: number) => {
    const value = no
    setSticker(value)
  }

  const matchingSticker = stickerList.find(
    (sticker) => sticker.no === stickerNo
  )

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
        <img className="w-6 h-6" src="/assets/icons/x_dark.png" alt="X" />
        <img
          className="w-8 h-6"
          src="/assets/icons/check_dark.png"
          alt="체크"
        />
      </div>
      <CardContainer className="mt-4 m-auto overflow-hidden">
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
        <div className="flex w-40 h-40 items-center m-auto mt-4 bg-white bg-opacity-25">
          <img
            className="w-8 h-8 m-auto opacity-80"
            src="/assets/icons/img_select.png"
            alt="사진"
          />
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
      <div>
        <div className="bg-black bg-opacity-10 mt-4 flex flex-nowrap overflow-y-auto">
          {stickerList.length !== 0 &&
            stickerList.map((s: StickerType) => (
              <img
                className="w-16 m-3"
                src={s.icon}
                onClick={() => selectSticker(s.no)}
                alt="icon"
              />
            ))}
        </div>
        <div className="flex h-64 w-full flex-wrap overflow-x-auto content-start">
          {matchingSticker &&
            Object.values(matchingSticker.sticker).map(
              (stickerImage, index) => (
                <img
                  className="w-16 m-4"
                  key={index}
                  src={stickerImage}
                  alt={`Sticker ${index + 1}`}
                />
              )
            )}
        </div>
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
  overflow-x: hidden;
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
