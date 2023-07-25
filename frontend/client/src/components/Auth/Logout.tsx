import React, { useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { getCookieToken, removeCookieToken } from '../../store/Cookie'
import { DELETE_TOKEN } from '../../store/Auth'
import { serverUrl } from '../../urls'

export const Logout = function () {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        axios({
            method: 'POST',
            url: serverUrl + 'user/logout',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + getCookieToken(),
            },
            data: {},
        })
            .then(() => {
                dispatch(DELETE_TOKEN())
                removeCookieToken()
                navigate('/login')
            })
            .catch((error) => console.error(error))
    }, [])

    return <div></div>
}
