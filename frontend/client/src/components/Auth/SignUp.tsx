import React, {useState} from 'react'
import { styled } from "styled-components";
import axios from 'axios'

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

    function checkOverlap (event:React.MouseEvent<HTMLButtonElement>) {
        
    }

    function handleSubmit (event:React.FormEvent<HTMLFormElement>){
        event.preventDefault()
    }

    return (
        <div>
          <Form onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input name='email' type="email" value={userdata.email} onChange={handleChange}/>
            <button onClick={checkOverlap}>중복체크</button>

            <label htmlFor="password">Password</label>
            <input name='password' type="password" value={userdata.password} onChange={handleChange}/>

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