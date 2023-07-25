import axios from 'axios'
import React from 'react'
import { serverUrl } from '../../urls'
import { setRefreshToken } from '../../store/Cookie'
import { useDispatch } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { SET_TOKEN } from '../../store/Auth'

export const DummyKakao = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    let getParameter = (key: string) => {
        return new URLSearchParams(window.location.search).get(key)
    }
    let code = getParameter('code')

    axios({
        method: 'GET',
        url: serverUrl + 'api/kakao/login',
        headers: {
            'Content-Type': 'application/json',
        },
        data: { code: code },
    })
        .then((response) => {
            console.log(response)

            // setRefreshToken(response.data.refreshToken)
            // dispatch(SET_TOKEN(response.data.accessToken))
            // navigate('/main')
        })
        .catch((err) => console.error(err))

    return <div></div>
}
