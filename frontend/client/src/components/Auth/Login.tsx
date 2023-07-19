import React, {useState} from "react"
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { styled } from "styled-components";
import axios from "axios";
import {serverUrl, reqUrl} from '../../urls'
import {SET_TOKEN} from '../../store/Auth'
import {setRefreshToken} from '../../store/Cookie'

const Form = styled.form`
    display: flex;
    flex-wrap: wrap;
    width: 200px;
    margin-left: auto;
    margin-right: auto;
`
const KakaoLink = styled(Form)``

const Login = function () {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [userdataText, setUserdataText] = useState('')
    const size = {width: "400px", marginBottom: "10px"}

    const navigate = useNavigate()
    const dispatch = useDispatch()

    function inputEmail (e:React.FormEvent<HTMLInputElement>) {
        setEmail(e.currentTarget.value)
    }
    function inputPassword (e:React.FormEvent<HTMLInputElement>) {
        setPassword(e.currentTarget.value)
    }

    function formSubmit (e:React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        
        axios({
            method: "POST",
            url: serverUrl + "login/",
            data: {
                'email' : email,
                'password' : password
            },
        })
        .then(response => {
            if(response.data === 'no user'){
                setUserdataText('아이디가 존재하지 않습니다.')
            }
            else if(response.data === 'fail password'){
                setUserdataText('비밀번호가 일치하지 않습니다.')
            }
            else{
                setRefreshToken(response.data.refreshToken)
                dispatch(SET_TOKEN(response.data.accessToken))
                navigate('/')
            }
        })
        .catch(error => {
            console.error(error)
        })
    }

    return (
        <div>
          <Form onSubmit={formSubmit}>
            <label htmlFor="email-input" style={size}>Email</label>
            <input id="email-input" type="text" value={email} onChange={inputEmail} style={size}/>
            <label htmlFor="password-input" style={size}>Password</label>
            <input id="password-input" type="password" value={password} onChange={inputPassword} style={size}/>
            <p style={{color: 'red'}}>{userdataText}</p>
            <button>제출</button>
          </Form>
          <KakaoLink as="a" href={reqUrl}><img src="kakao_login_medium_narrow1.png" alt="카카오톡 로그인" width="200px" height="50px"/></KakaoLink>
        </div>
    )
}

export default Login