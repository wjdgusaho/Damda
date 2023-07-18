import React from 'react'
import { Link } from "react-router-dom";
import { useDispatch } from 'react-redux';
import {removeCookieToken} from '../../store/Cookie'
import {DELETE_TOKEN} from '../../store/Auth'

export const Logout = function () {
    const dispatch = useDispatch()

    dispatch(DELETE_TOKEN())
    removeCookieToken()
    return (
        <div>
            로그아웃됨
            <Link to={"/"}>메인페이지로 가기</Link>
        </div>
    )
}