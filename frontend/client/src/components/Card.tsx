import React, { useEffect, useRef, useState } from "react"
import { styled } from "styled-components"
import html2canvas from "html2canvas"
import StickerContainer from "./StickerContainer"
import { useNavigate, useParams } from "react-router-dom"
import Modal from "react-modal"
import axios from "axios"
import { serverUrl } from "../urls"
import { useSelector } from "react-redux"
import { RootState } from "../store/Store"

export interface StickerType {
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
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    borderRadius: "20px",
    backgroundColor: "rgb(255, 255, 255)",
    color: "rgb(93, 93, 93)",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.733)",
  },
}

const Card = function () {
  const [inputValue, setInputValue] = useState("")
  const [stickerList, setStickerList] = useState<StickerType[]>([])
  const [inputContentValue, setInputContentValue] = useState("")
  const [bgcolor, setBgcolor] = useState("#C4C5F4")
  const [font, setFont] = useState("pretendard")
  const [stickerNo, setSticker] = useState(-1)
  const [title, setTitle] = useState("오늘의 제목")
  const [cardContent, setCardContent] = useState("오늘의 내용을 입력해주세요!")
  const [countList, setCountList] = useState<{ no: number; url: string }[]>([])
  const UserData = useSelector((state: RootState) => state.auth.userInfo)
  const token = useSelector((state: RootState) => state.auth.accessToken)
  const currentDate = new Date()
  const year = currentDate.getFullYear()
  const month = String(currentDate.getMonth() + 1).padStart(2, "0")
  const day = String(currentDate.getDate()).padStart(2, "0")
  const navigate = useNavigate()
  const timecapsuleNo = useParams()

  const goBack = () => {
    navigate(-1) // 뒤로가기
  }

  function imgChange() {
    const fileinput = document.getElementById("cardImage") as HTMLInputElement
    fileinput.click()
  }

  const handleChange = (e: { target: { value: any } }) => {
    const value = e.target.value
    setTitle(value)
    setInputValue(value)
  }
  const handleChangeContent = (e: { target: { value: any } }) => {
    const value = e.target.value
    setCardContent(value)
    setInputContentValue(value)
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

  const onAddCardSticker = (stickerImage: string) => {
    console.log("스티커클릭", countList)

    // 새로운 스티커 정보 생성
    const newSticker = { no: countList.length, url: stickerImage }

    // 기존 스티커 배열과 새로운 스티커 정보를 합쳐서 새로운 배열을 만듦
    const updatedStickers = [...countList, newSticker]

    // 새로운 배열을 상태로 설정
    setCountList(updatedStickers)
  }
  const onDeleteCardSticker = (no: number) => {
    console.log("스티커삭제", countList)

    // countList에서 no에 해당하는 원소를 제외한 새로운 배열 생성
    const updatedStickers = countList.filter((sticker) => sticker.no !== no)

    // 새로운 배열을 상태로 설정
    setCountList(updatedStickers)
  }

  useEffect(() => {
    console.log("token", token)
    const fetchData = async () => {
      try {
        const response = await axios.get(serverUrl + "timecapsule/deco/list", {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        console.log(response)
        setStickerList(response.data.data.decoList)
        setSticker(3)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    // countList가 변경되면 호출됨
    console.log(countList)
  }, [countList])

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
    inputValue.length <= 5 ? "100px" : `${inputValue.length * 8 + 100}px`

  const sendFileToServer = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append("cardImage", file)

      if (timecapsuleNo.capsuleId !== undefined) {
        formData.append(
          "timecapsuleNo",
          new Blob([JSON.stringify(timecapsuleNo.capsuleId)], {
            type: "application/json",
          })
        )
      }

      const response = await axios.post(
        serverUrl + "timecapsule/regist/card",
        formData,
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "multipart/form-data",
          },
        }
      )

      console.log(response.data.code)
      if (response.data.code === 200) {
        alert("정상적으로 저장되었습니다.")
        navigate(-1)
      } else if (response.data.code === 200) {
        alert("오늘은 이미 카드작성을 완료하였습니다.")
      } else {
        alert("카드 저장에 실패했습니다.")
      }
    } catch (error) {
      console.error(error)
    }
  }

  const saveAsImageHandler = () => {
    const target = document.getElementById("saveImgContainer")
    if (!target) {
      return alert("결과 저장에 실패했습니다.")
    }

    html2canvas(target, {
      useCORS: true,
      scale: 2,
    }).then((canvas) => {
      canvas.toBlob((blob) => {
        if (blob) {
          // Blob 객체를 이미지 파일로 변환
          const imageFile = new File([blob], "result_image.jpg", {
            type: "image/jpeg",
          })

          sendFileToServer(imageFile) // 이미지 파일을 서버로 보냅니다.
        }
      }, "image/jpeg")
    })
  }

  const StickerContainerArea = useRef<HTMLDivElement>(null)

  const [cardImage, setCardImage] = useState<File | null>(null)
  const imageRef = useRef<HTMLInputElement>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null
    if (file) {
      setCardImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const [modalXIsOpen, setXIsOpen] = React.useState(false)
  const [modalYIsOpen, setYIsOpen] = React.useState(false)

  function openXModal() {
    setXIsOpen(true)
  }

  function closeModal() {
    setXIsOpen(false)
    setYIsOpen(false)
  }
  function openYModal() {
    setYIsOpen(true)
  }

  return (
    <BackGround bgColor={bgcolor} className="overflow-hidden w-full h-full">
      <div className="m-auto pt-6 h-14 flex w-72 justify-between">
        <img
          className="w-6 h-6"
          onClick={openXModal}
          src="/assets/icons/x_dark.png"
          alt="X"
        />
        <img
          onClick={openYModal}
          className="w-8 h-6"
          src="/assets/icons/check_dark.png"
          alt="체크"
        />
      </div>
      <Modal
        isOpen={modalXIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="X Modal"
      >
        <div className="text-center font-semibold">
          작성된 내용이 저장되지 않아요!
          <br />
          그래도 취소하시겠어요?
        </div>
        <div className="flex mt-4 w-48 m-auto justify-between">
          <ModalButton className="bg-black bg-opacity-0" onClick={closeModal}>
            <span className="font-bold text-gray-400">닫기</span>
          </ModalButton>
          <ModalButton className="bg-black bg-opacity-10" onClick={goBack}>
            <span className="font-bold text-gray-900">작성취소</span>
          </ModalButton>
        </div>
      </Modal>
      <Modal
        isOpen={modalYIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="submit Modal"
      >
        <div className="text-center font-semibold">
          사진을 첨부했는지 꼭 확인해주세요! <br />
          카드를 등록하시겠어요?
          <br />
          <span className="font-extralight">
            (등록 후에는 수정할 수 없어요)
          </span>
        </div>
        <div className="flex mt-4 w-48 m-auto justify-between">
          <ModalButton className="bg-black bg-opacity-0" onClick={closeModal}>
            <span className="font-bold text-gray-400">닫기</span>
          </ModalButton>
          <ModalButton
            className="bg-black bg-opacity-10"
            onClick={saveAsImageHandler}
          >
            <span className="font-bold text-gray-900">등록</span>
          </ModalButton>
        </div>
      </Modal>
      <CardContainer
        bgColor={bgcolor}
        id="saveImgContainer"
        className="mt-4 m-auto overflow-hidden"
      >
        <div className="flex justify-between p-2 text-sm">
          <div className="flex">
            <img
              className="w-8 mr-1"
              src="/assets/icons/profile_1.png"
              alt="프로필사진"
            />
            <span className="mt-1 font-light text-neutral-500">
              <Text font={font}>{UserData.nickname}</Text>
            </span>
          </div>
          <div className="font-light text-neutral-500">
            <Text font={font}>
              {year}.{month}.{day}
            </Text>
          </div>
        </div>
        <div ref={StickerContainerArea}>
          <div className="relative text-center -mt-2">
            <Title
              id="inputTitle"
              className="w-full h-4 opacity-0 overflow-hidden"
              type="text"
              value={inputValue}
              onChange={handleChange}
              placeholder={inputValue ? "" : "오늘의 제목"}
              width={inputWidth}
              font={font}
              maxLength={15}
            />
            <TitleBG width={inputWidth} className="m-auto"></TitleBG>
            <label
              className="block text-center -mt-6 absolute w-full"
              htmlFor="inputTitle"
            >
              <InputResult className="ml-2" font={font}>
                {title}
              </InputResult>
            </label>
          </div>
          <img
            src={
              selectedImage ? selectedImage : "/assets/icons/cardImgSelect.png"
            }
            onClick={imgChange}
            alt="카드이미지"
            className="flex w-40 h-40 items-center m-auto mt-4 mb-1"
          />
          <input
            id="cardImage"
            name="cardImage"
            type="file"
            className="hidden"
            onChange={handleImageChange}
            ref={imageRef}
          />
          <div className="text-center">
            <div className="relative text-center -mt-2">
              <label
                className="block text-center opacity-70 !text-xs mt-2 absolute w-full ml-2"
                htmlFor="inputContent"
              >
                <InputResult font={font}>{cardContent}</InputResult>
              </label>
              <Content
                className="bg-white opacity-0 !text-xs mt-2 w-full"
                rows={5}
                maxLength={150}
                font={font}
                id="inputContent"
                onChange={handleChangeContent}
              ></Content>
            </div>
          </div>
          <StickerContainer
            countList={countList}
            onDeleteCardSticker={onDeleteCardSticker}
            StickerContainerArea={StickerContainerArea}
          />
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
      <div className="fixed bottom-0">
        <div className="bg-black bg-opacity-10 flex flex-nowrap overflow-y-auto">
          {stickerList.length !== 0 &&
            stickerList.map((s: StickerType) => (
              <img
                key={s.no}
                className="w-16 m-3"
                src={s.icon}
                onClick={() => selectSticker(s.no)}
                alt="icon"
              />
            ))}
        </div>
        <div className="flex h-52 w-full flex-wrap overflow-x-auto content-start">
          {matchingSticker &&
            Object.values(matchingSticker.sticker).map(
              (stickerImage, index) => (
                <Sticker
                  className="w-16 m-4"
                  key={index}
                  src={stickerImage}
                  // src="/assets/stickers/doodle/1.png"
                  alt={`Sticker ${index + 1}`}
                  onClick={() => onAddCardSticker(stickerImage)}
                />
              )
            )}
        </div>
      </div>
    </BackGround>
  )
}

const ModalButton = styled.div`
  font-family: "pretendard";
  font-weight: 400;
  font-size: 18px;
  width: 80px;
  height: 26px;
  border-radius: 30px;
  text-align: center;
  box-shadow: 0px 4px 4px ${(props) => props.theme.colorShadow};
  color: #000000b1;
`

interface BackGroundProps {
  bgColor: string
}

const BackGround = styled.div<BackGroundProps>`
  background-color: ${(props) => props.bgColor};
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
`

const CardContainer = styled.div<BackGroundProps>`
  background-color: ${(props) => props.bgColor};
  border: 1px solid #545454;
  width: 350px;
  height: 350px;
`

interface TitleProps {
  width: string
  color?: string
  font?: string
}

const Title = styled.input<TitleProps>`
  width: ${(props) => props.width};
  outline: none;
  font-family: ${(props) => props.font};
  font-size: 4px;
  text-align: left;
  &::placeholder {
    color: #80808081;
  }
`
const InputResult = styled.div<ContentProps>`
  font-family: ${(props) => props.font};
  width: 330px;
`

const TitleBG = styled.div<TitleProps>`
  width: ${(props) => props.width};
  background-color: #ff4a4a7b;
  height: 7px;
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
const Sticker = styled.img``
export default Card
