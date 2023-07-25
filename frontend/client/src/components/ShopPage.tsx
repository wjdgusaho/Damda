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

const NavTextStyle = styled.span`
    font-family: 'pretendard';
    font-weight: 200;
    color: #fff;
    transition: color 0.2s, border-bottom 0.2s;
`;

const ShopPage = function () {
    return (
        <div>
            <SubHeader></SubHeader>
            <div className='text-white opacity-70'>
                <div className='text-center mt-10'>
                    <TextStyle className='text-xl'>상점</TextStyle>
                </div>
                <CoinContainer>
                    <TextStyle className='text-sm text-white'>30코인 보유중</TextStyle>
                </CoinContainer>
            </div>
            <div className='flex justify-evenly mt-6'>
                <NavLink to="/shop/sticker"><NavTextStyle>스티커</NavTextStyle></NavLink>
                <NavLink to="/shop/theme"><NavTextStyle>테마</NavTextStyle></NavLink>
                <NavLink to="/shop/theme"><NavTextStyle>타임캡슐</NavTextStyle></NavLink>
            </div>
            <Outlet />
        </div>
    );
}

export const Sticker = function () {
    return (
        <div>
            sdfsdazaf
        </div>
    );
}
export const Theme = function () {
    return (
        <div>
            sdfsdf
        </div>
    );
}

export default ShopPage;
