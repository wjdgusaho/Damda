import React, { useState, useRef } from "react"
import { SubHeader } from "./inc/SubHeader"
import { styled } from "styled-components"
import { NavLink, Navigate, Outlet } from "react-router-dom"
import Modal from "react-modal"
import { useNavigate } from "react-router-dom"

export const ShopPage = function () {
  return (
    <div>
      <SubHeader></SubHeader>
      <div className="text-white opacity-80">
        <div className="text-center mt-10">
          <TextStyle className="text-xl">상점</TextStyle>
        </div>
        <CoinContainer>
          <TextStyle className="text-sm text-white">30코인 보유중</TextStyle>
        </CoinContainer>
      </div>
      <div className="flex justify-evenly mt-6 mb-8">
        <NavLink2 to="/shop/sticker">스티커</NavLink2>
        <NavLink2 to="/shop/theme">테마</NavLink2>
        <NavLink2 to="/shop/capsule">타임캡슐</NavLink2>
      </div>
      <Outlet />
    </div>
  )
}

export const Sticker = function () {
  return (
    <div>
      <div className="ml-8 mb-4">
        <input type="checkbox" name="" id="" />
        <label htmlFor="">
          <TextStyle className="inline text-white ml-2 opacity-70">
            보유중인 상품만
          </TextStyle>
        </label>
      </div>

      <Card></Card>
      <CardLine></CardLine>
      <Card></Card>
      <CardLine></CardLine>
      <Card></Card>
      <CardLine></CardLine>
    </div>
  )
}
export const Theme = function () {
  return (
    <div>
      <div className="ml-8 mb-4">
        <input type="checkbox" name="" id="" />
        <label htmlFor="">
          <TextStyle className="inline text-white ml-2 opacity-70">
            보유중인 상품만
          </TextStyle>
        </label>
      </div>
      <Card></Card>
      <CardLine></CardLine>
      <Card></Card>
      <CardLine></CardLine>
    </div>
  )
}
export const Capsule = function () {
  return (
    <div>
      <Card></Card>
      <CardLine></CardLine>
      <Card></Card>
      <CardLine></CardLine>
      <Card></Card>
      <CardLine></CardLine>
    </div>
  )
}

const Card = function () {
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
        <img src="/assets/Planet-3.png" alt="카드이미지" />
      </div>
      <div className="w-40 h-40 text-center">
        <TextStyle className="mt-1 text-white text-lg">문자 (파랑색)</TextStyle>
        <div className="flex justify-center items-center w-20 h-6 mt-1 bg-white bg-opacity-10 rounded-full m-auto">
          <TextStyle className=" text-white text-sm">30코인</TextStyle>
        </div>
        <div className="flex justify-center items-center w-36 h-14 mt-1 m-auto">
          <TextStyle className=" text-white text-sm">
            알파벳, 숫자, 특수기호가 포함되어 있어요
          </TextStyle>
        </div>
        <div
          onClick={openModal}
          className="flex justify-center items-center w-24 h-6 mt-2 bg-white bg-opacity-30 rounded-full m-auto"
        >
          <TextStyle className=" text-white text-md">구매하기</TextStyle>
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="BUY Modal"
      >
        <ModalCapsuleInner></ModalCapsuleInner>
        <div className="flex mt-4 w-48 justify-center m-auto justify-between">
          <ModalButton className="bg-black bg-opacity-10" onClick={closeModal}>
            취소
          </ModalButton>
          <ModalButton className="bg-lilac-500" onClick={closeModal}>
            구매
          </ModalButton>
        </div>
      </Modal>
    </div>
  )
}

// 일반 구매 팝업
const ModalBuyInner = function () {
  return (
    <div className="flex items-center justify-around">
      <div className="w-1/3 p-2 rounded-2xl mr-2 shadow-lg">
        <img src="/assets/Planet-2.png" alt="모달이미지" />
      </div>
      <div className="w-2/3 p-2">
        <TextStyle7 className="opacity-70 text-lg">
          우주를<br></br> 구매하시겠습니까?
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
      <div className="border-solid border-lilac-900 border rounded-2xl w-full p-4">
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
    <div className="flex m-auto mb-1 bg-lilac-100 rounded-lg p-2 justify-around items-center">
      <div className="w-2/12">
        <img
          className="filter drop-shadow-md"
          src="/assets/Planet-5.png"
          alt=""
        />
      </div>
      <div className="w-8/12 text-left pl-3">
        <TextStyle5 className="">우리 1년 뒤 보자!</TextStyle5>
        <TextStyle3 className="text-xs text-lilac-800">300 / 500 MB</TextStyle3>
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
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  color: #000000b1;
`
const TextStyle7 = styled.div`
  font-family: "pretendard";
  font-weight: 700;
`
const TextStyle5 = styled.div`
  font-family: "pretendard";
  font-weight: 500;
`
const TextStyle3 = styled.div`
  font-family: "pretendard";
  font-weight: 300;
`
const TextStyle = styled.div`
  font-family: "pretendard";
  font-weight: 400;
`

const CoinContainer = styled.div`
  background-color: #ffffff2e;
  color: white;
  width: 100px;
  text-align: center;
  margin-left: auto;
  margin-right: 20px;
  border-radius: 10px;
`

const NavLink2 = styled(NavLink)`
  position: relative;
  text-decoration: none;
  font-family: "pretendard";
  font-weight: 200;
  color: #ffffffac;
  transition: color 0.2s;
  display: inline-flex;
  align-items: center; /* Align the text and underline vertically */
  width: 120px;
  justify-content: center;
  &.active {
    font-weight: 400;
    color: #ffffff;

    &::after {
      content: "";
      position: absolute;
      bottom: -10px; /* Adjust the value to control the underline's position */
      width: 100%;
      height: 1px;
      background-color: #ffffff;
    }
  }
`

const CardLine = styled.div`
  width: 300px;
  height: 1px;
  background-color: white;
  margin: 20px auto 20px auto;
`

export default ShopPage
