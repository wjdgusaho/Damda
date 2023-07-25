import React from 'react';
import { SubHeader } from './inc/SubHeader';
import { styled } from 'styled-components'
import { NavLink, Outlet } from 'react-router-dom';

const TextStyle = styled.div`
    font-family: 'pretendard';
    font-weight: 400;
`;

const CoinContainer = styled.div`
    background-color: #ffffff2e;
    color: white;
    width: 100px;
    text-align: center;
    margin-left: auto;
    margin-right: 20px;
    border-radius: 10px;
`;

const NavLink2 = styled(NavLink)`
  position: relative;
  text-decoration: none;
  font-family: 'pretendard';
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
      content: '';
      position: absolute;
      bottom: -10px; /* Adjust the value to control the underline's position */
      width: 100%;
      height: 1px;
      background-color: #ffffff;
    }
  }
`;

export const ShopPage = function () {
    return (
        <div>
            <SubHeader></SubHeader>
            <div className='text-white opacity-80'>
                <div className='text-center mt-10'>
                    <TextStyle className='text-xl'>상점</TextStyle>
                </div>
                <CoinContainer>
                    <TextStyle className='text-sm text-white'>30코인 보유중</TextStyle>
                </CoinContainer>
            </div>
            <div className='flex justify-evenly mt-6 mb-8'>
                <NavLink2 to="/shop/sticker">스티커</NavLink2>
                <NavLink2 to="/shop/theme">테마</NavLink2>
                <NavLink2 to="/shop/capsule">타임캡슐</NavLink2>
            </div>
            <Outlet />
        </div>
    );
}
const Card = function () {
    return (
        <div className='w-80 h-40 bg-white bg-opacity-10 m-auto rounded-3xl flex shadow-2xl'>
            <div className='w-40 h-40 bg-white opacity-100 rounded-3xl'>
                <img src="/assets/Planet-3.png" alt="카드이미지" />
            </div>
            <div className='w-40 h-40 text-center'>
                <TextStyle className='mt-1 text-white text-lg'>문자 (파랑색)</TextStyle>
                <div className='flex justify-center items-center w-20 h-6 mt-1 bg-white bg-opacity-10 rounded-full m-auto'>
                    <TextStyle className=' text-white text-sm'>30코인</TextStyle>
                </div>
                <div className='flex justify-center items-center w-36 h-14 mt-1 m-auto'>
                    <TextStyle className=' text-white text-sm'>알파벳, 숫자, 특수기호가
                        포함되어 있어요</TextStyle>
                </div>
                <div className='flex justify-center items-center w-24 h-6 mt-2 bg-white bg-opacity-30 rounded-full m-auto'>
                    <TextStyle className=' text-white text-md'>구매하기</TextStyle>
                </div>
            </div>
        </div>
    );
}

const CardLine = styled.div`
    width: 300px;
    height: 1px;
    background-color: white;
    margin: 20px auto 20px auto;
`

export const Sticker = function () {
    return (
        <div>
            <div className='ml-8 mb-4'>
                <input type="checkbox" name="" id="" />
                <label htmlFor=""><TextStyle className='inline text-white ml-2 opacity-70'>보유중인 상품만</TextStyle></label>
            </div>
            <Card></Card>
            <CardLine></CardLine>
            <Card></Card>
            <CardLine></CardLine>
            <Card></Card>
            <CardLine></CardLine>
        </div>
    );
}
export const Theme = function () {
    return (
        <div>
            <div className='ml-8 mb-4'>
                <input type="checkbox" name="" id="" />
                <label htmlFor=""><TextStyle className='inline text-white ml-2 opacity-70'>보유중인 상품만</TextStyle></label>
            </div>
            <Card></Card>
            <CardLine></CardLine>
            <Card></Card>
            <CardLine></CardLine>
        </div>
    );
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
    );
}



export default ShopPage;
