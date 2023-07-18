import React, {useState} from "react";
import { styled } from "styled-components";
import axios from "axios";
import {serverUrl, reqUrl} from '../../urls'

const Form = styled.form`
    display: flex;
    flex-wrap: wrap;
    width: 200px;
    margin-left: auto;
    margin-right: auto;
`

const Login = function () {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const size = {width: "400px", marginBottom: "10px"}

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
            url: serverUrl + "user/login/",
            data: {
                'email' : email,
                'password' : password
            },
        })
        .then(response => {
            console.log(response)
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
            <button>제출</button>
          </Form>
          <a href={reqUrl}>카카오톡 로그인</a>
        </div>
    )
}

export default Login