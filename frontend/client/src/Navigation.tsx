import React from "react";
import { Link } from "react-router-dom";
import styled from 'styled-components';
import {getCookieToken} from './store/Cookie'

const Navbar = styled.nav`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 120px;
`;

const Navigation = function () {
    return (
        <Navbar>
            <Link to="/">메인페이지</Link>
            <Link to="/user">마이페이지</Link>
            <Link to="/shop">상점페이지</Link>
            <Link to="/timecapsule">타임캡슐페이지</Link>
            <Link to="/card">카드페이지</Link>
            <Link to="/friend">친구페이지</Link>
            <Link to="/login">로그인페이지</Link>
            <Link to="/signup">회원가입페이지</Link>
            {getCookieToken() && <Link to="/logout">로그아웃페이지</Link>}
            <Link to="/landing">로딩페이지</Link>
        </Navbar>
    )
}

export default Navigation