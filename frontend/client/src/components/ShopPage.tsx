import React, { useState, useRef, useEffect } from "react"
import { SubHeader } from "./inc/SubHeader"
import { styled, css } from "styled-components"
import Modal from "react-modal"
import axios, { Axios } from "axios"
import { serverUrl, reqUrl } from "../urls"
import { RootState } from "../store/Store"
import { useSelector } from "react-redux"

interface themeType {
  themeNo: number
  name: string
  description: string
  price: number
  icon: string
  userHave: boolean
}
interface capsuleItemType {
  itemNo: number
  name: string
  description: string
  price: number
  type: string
  icon: string
  userHave: boolean
}
interface decoItemType {
  itemNo: number
  name: string
  description: string
  price: number
  icon: string
  type: string
  userHave: boolean
}

export const ShopPage = function () {
  const token = useSelector((state: RootState) => state.auth.accessToken)
  const [themeList, setThemeList] = useState<themeType[]>([])
  const [capsuleItemList, setCapsuleItemList] = useState<capsuleItemType[]>([])
  const [decoItemList, setDecoItemList] = useState<decoItemType[]>([])
  const [comp, setComp] = useState("Sticker")
  const [activeComponent, setActiveComponent] = useState("Sticker")
  const UserData = useSelector((state: RootState) => state.auth.userInfo)

  useEffect(() => {
    console.log("token", token)
    const fetchData = async () => {
      try {
        const response = await axios.get(serverUrl + "shop/list", {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        setThemeList(response.data.data.themeList)
        setCapsuleItemList(response.data.data.capsuleItemList)
        setDecoItemList(response.data.data.decoItemList)
        console.log(response)
        console.log("themeList", response.data.data.themeList)
        console.log("capsuleItemList", response.data.data.capsuleItemList)
        console.log("decoItemList", response.data.data.decoItemList)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [])

  const handleNavClick = (compName: string) => {
    setActiveComponent(compName)
  }

  console.log("userData", UserData)
  return (
    <div>
      <SubHeader></SubHeader>
      <div>
        <div className="text-center mt-10">
          <TextStyle className="text-xl">상점</TextStyle>
        </div>
        <CoinContainer>
          <TextStyle className="text-sm">{UserData.coin} 코인</TextStyle>
        </CoinContainer>
      </div>
      <div className="flex justify-evenly mt-6 mb-8">
        <Nav
          onClick={() => {
            setComp("Sticker")
            handleNavClick("Sticker")
          }}
          isActive={activeComponent === "Sticker"}
        >
          스티커
        </Nav>
        <Nav
          onClick={() => {
            setComp("Theme")
            handleNavClick("Theme")
          }}
          isActive={activeComponent === "Theme"}
        >
          테마
        </Nav>
        <Nav
          onClick={() => {
            setComp("Capsule")
            handleNavClick("Capsule")
          }}
          isActive={activeComponent === "Capsule"}
        >
          타임캡슐
        </Nav>
      </div>
      {comp === "Sticker" && <Sticker decoItemList={decoItemList} />}
      {comp === "Theme" && <Theme themeList={themeList} />}
      {comp === "Capsule" && <Capsule capsuleItemList={capsuleItemList} />}
    </div>
  )
}

interface StickerProps {
  decoItemList: decoItemType[]
}

export const Sticker: React.FC<StickerProps> = ({ decoItemList }) => {
  const [showOnlyOwned, setShowOnlyOwned] = useState(false)

  const filteredDecoItems = showOnlyOwned
    ? decoItemList.filter((d) => d.userHave)
    : decoItemList

  return (
    <div>
      <div className="ml-8 mb-4">
        <input
          id="isHave"
          type="checkbox"
          checked={showOnlyOwned}
          onChange={() => setShowOnlyOwned(!showOnlyOwned)}
        />
        <label htmlFor="isHave">
          <TextStyle className="inline ml-2 opacity-70">
            보유중인 상품만
          </TextStyle>
        </label>
      </div>
      {filteredDecoItems.length > 0 &&
        filteredDecoItems.map((d) => (
          <div key={d.itemNo}>
            <Card
              name={"스티커 " + (d.itemNo - 2)}
              price={d.price}
              desc={d.description}
              isHave={d.userHave}
              icon={d.icon}
            ></Card>
            <CardLine></CardLine>
          </div>
        ))}
    </div>
  )
}

interface ThemeProps {
  themeList: themeType[]
}
export const Theme: React.FC<ThemeProps> = ({ themeList }) => {
  return (
    <div>
      <div className="ml-8 mb-4">
        <input type="checkbox" name="" id="" />
        <label htmlFor="">
          <TextStyle className="inline ml-2 opacity-70">
            보유중인 상품만
          </TextStyle>
        </label>
      </div>
      {themeList.length > 0 &&
        themeList.map((t) => (
          <div key={t.themeNo}>
            <Card
              name={t.name}
              price={t.price}
              desc={t.description}
              isHave={t.userHave}
              icon={t.icon}
            ></Card>
            <CardLine></CardLine>
          </div>
        ))}
    </div>
  )
}

interface CapsuleProps {
  capsuleItemList: capsuleItemType[]
}

export const Capsule: React.FC<CapsuleProps> = ({ capsuleItemList }) => {
  return (
    <div>
      {capsuleItemList.length > 0 &&
        capsuleItemList.map((c) => (
          <div key={c.itemNo}>
            <Card name={c.name} price={c.price} desc={c.description}></Card>
            <CardLine></CardLine>
          </div>
        ))}
    </div>
  )
}

interface CardProps {
  name?: string
  price?: number
  desc?: string
  isHave?: boolean
  icon?: string
}

export const Card: React.FC<CardProps> = ({
  name,
  price,
  desc,
  isHave,
  icon,
}) => {
  const [modalIsOpen, setIsOpen] = React.useState(false)

  function openModal() {
    setIsOpen(true)
  }

  function closeModal() {
    setIsOpen(false)
  }

  return (
    <div className="w-80 h-40 bg-white bg-opacity-10 m-auto rounded-3xl flex shadow-2xl">
      <div className="w-40 h-40 bg-white opacity-100 rounded-3xl">
        <img className="w-full h-full " src={icon} alt="카드이미지" />
      </div>
      <div className="w-40 h-40 text-center">
        <TextStyle className="mt-1 text-white text-lg">{name}</TextStyle>
        <div className="flex justify-center items-center w-20 h-6 mt-1 bg-white bg-opacity-10 rounded-full m-auto">
          <TextStyle className=" text-white text-sm">{price}코인</TextStyle>
        </div>
        <div className="flex justify-center items-center w-36 h-14 mt-1 m-auto">
          <TextStyle className=" text-white text-sm">{desc}</TextStyle>
        </div>
        <div
          onClick={openModal}
          className="flex justify-center items-center w-24 h-6 mt-2 bg-white bg-opacity-30 rounded-full m-auto"
        >
          <TextStyle className=" text-white text-md">
            {isHave ? "보유중" : "구매하기"}
          </TextStyle>
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="BUY Modal"
      >
        {name === "용량추가" && <ModalCapsuleInner></ModalCapsuleInner>}
        {name === "캡슐추가" && <ModalCapsuleInner></ModalCapsuleInner>}
        {name !== "캡슐추가" && name !== "용량추가" && (
          <ModalBuyInner name={name}></ModalBuyInner>
        )}
        <div className="flex mt-4 w-48 m-auto justify-between">
          <ModalButton className="bg-black bg-opacity-0" onClick={closeModal}>
            취소
          </ModalButton>
          <ModalButton className="bg-black bg-opacity-10" onClick={closeModal}>
            구매
          </ModalButton>
        </div>
      </Modal>
    </div>
  )
}

interface ModalBuyInnerProps {
  name?: string
  icon?: string
}

// 일반 구매 팝업
export const ModalBuyInner: React.FC<ModalBuyInnerProps> = ({ name, icon }) => {
  return (
    <div className="flex items-center justify-around">
      <div className="w-1/3 p-2 rounded-2xl mr-2 shadow-lg">
        <img src="/assets/universe/Planet-2.png" alt="모달이미지" />
      </div>
      <div className="w-2/3 p-2">
        <TextStyle7 className="opacity-70 text-lg">
          {name}
          <br></br> 구매하시겠습니까?
        </TextStyle7>
      </div>
    </div>
  )
}

// 타임캡슐 용량 구매 팝업
const ModalCapsuleInner = function () {
  return (
    <div className="text-center">
      <TextStyle7 className="opacity-70 text-lg mb-4">
        타임캡슐을 선택해주세요
      </TextStyle7>
      <div className="border-solid border-gray-700 border rounded-2xl w-full p-4">
        <MyCapsule />
        <MyCapsule />
        <MyCapsule />
      </div>
    </div>
  )
}

// 내가 가진 타임캡슐
const MyCapsule = function () {
  return (
    <div className="flex m-auto mb-1 rounded-lg p-2 justify-around items-center">
      <div className="w-2/12">
        <img
          className="filter drop-shadow-md"
          src="/assets/universe/Planet-5.png"
          alt=""
        />
      </div>
      <div className="w-8/12 text-left pl-3">
        <TextStyle5 className="">우리 1년 뒤 보자!</TextStyle5>
        <TextStyle3 className="text-xs ">300 / 500 MB</TextStyle3>
      </div>
      <div className="w-2/12">
        <input type="radio" name="" id="" />
      </div>
    </div>
  )
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
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.733)",
  },
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
const TextStyle7 = styled.div`
  font-family: "pretendard";
  font-weight: 700;
  color: ${(props) => props.theme.colorCommon};
`
const TextStyle5 = styled.div`
  font-family: "pretendard";
  font-weight: 500;
  color: ${(props) => props.theme.colorCommon};
`
const TextStyle3 = styled.div`
  font-family: "pretendard";
  font-weight: 300;
  color: ${(props) => props.theme.colorCommon};
`
const TextStyle = styled.div`
  font-family: "pretendard";
  font-weight: 400;
  color: ${(props) => props.theme.colorCommon};
`

const CoinContainer = styled.div`
  background-color: #ffffff2e;
  color: white;
  width: 120px;
  text-align: center;
  margin-left: auto;
  margin-right: 20px;
  border-radius: 10px;
`

const Nav = styled.div<{ isActive: boolean }>`
  position: relative;
  text-decoration: none;
  font-family: "pretendard";
  font-weight: 400;
  color: ${(props) => props.theme.colorCommon};
  transition: color 0.2s;
  display: inline-flex;
  align-items: center;
  width: 120px;
  justify-content: center;

  &::after {
    content: "";
    position: absolute;
    bottom: -10px;
    width: 100%;
    height: 1px;
    background-color: ${(props) => props.theme.colorCommon};
    display: ${(props) => (props.isActive ? "block" : "none")};
  }
`

const CardLine = styled.div`
  width: 300px;
  height: 1px;
  background-color: ${(props) => props.theme.colorCommon};
  margin: 20px auto 20px auto;
`

export default ShopPage
