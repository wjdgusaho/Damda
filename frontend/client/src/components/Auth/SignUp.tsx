import React, {useState} from 'react'
import { styled } from "styled-components";
import axios from 'axios'
import {serverUrl} from '../../urls'

const Form = styled.form`
    display: flex;
    flex-wrap: wrap;
    width: 200px;
    margin-left: auto;
    margin-right: auto;
`

export const SignUp = function () {
    const [userdata, setUserdata] = useState({
        'email' : '',
        'password' : '',
        'passwordCheck' : '',
        'nickname' : '',
        'profilePicture' : undefined,
        'recommendNickname' : ''
    })

    function handleChange (event:React.FormEvent<HTMLInputElement>) {
        setUserdata({
            ...userdata,
            [event.currentTarget.name] : event.currentTarget.value,
        })
    }

    function passwordCheck (event:React.FormEvent<HTMLInputElement>){
        
    }

    function checkEmailOverlap (event:React.MouseEvent<HTMLButtonElement>) {
        axios.post(serverUrl+"user/register",{'email' : userdata.email})
        .then(response => {
            console.log(response)
        })
        .catch(error => console.error(error))
    }

    function handleSubmit (event:React.FormEvent<HTMLFormElement>){
        event.preventDefault()
    }

    return (
        <div>
          <Form onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input name='email' type="email" value={userdata.email} onChange={handleChange}/>
            <button onClick={checkEmailOverlap}>중복체크</button>

            <label htmlFor="password">Password</label>
            <input name='password' type="password" value={userdata.password} onChange={handleChange}/>

            <label htmlFor="passwordCheck">Password Check</label>
            <input name='passwordCheck' type="password" value={userdata.passwordCheck} onChange={handleChange}/>
            <p onChange={passwordCheck}>비밀번호가 일치하지 않습니다.</p>

            <label htmlFor="nickname">Nickname</label>
            <input name='nickname' type="text" value={userdata.nickname} onChange={handleChange}/>

            <label htmlFor="profilePicture">Profile Picture</label>
            <input name="profilePicture" type="file" value={userdata.profilePicture} onChange={handleChange}/>

            <label htmlFor="recommendNickname">Recommend Nickname</label>
            <input name="recommendNickname" type="text" value={userdata.recommendNickname} onChange={handleChange}/>

            <button>제출</button>
          </Form>
        </div>
    )
}