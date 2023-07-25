import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../../urls'
import { setRefreshToken } from '../../store/Cookie'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { SET_TOKEN } from '../../store/Auth'

export const DummyKakao = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        axios({
            method: 'GET',
            url: serverUrl + '/api/kakao/login',
            headers: {
                'Content-Type': 'application/json',
            },
            data: {},
        })
            .then((response) => {
                setRefreshToken(response.data.refreshToken)
                dispatch(SET_TOKEN(response.data.accessToken))
                navigate('/main')
            })
            .catch((err) => console.error(err))
    }, [])

    return <div></div>
}
