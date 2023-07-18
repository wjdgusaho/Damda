import React, {useState} from "react";
import { styled } from "styled-components";

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
        </div>
    )
}

export default Login