import React, {useState, useEffect} from 'react'
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
    const [passwordMatch, setPasswordMatch] = useState('')

    function handleChange (event:React.FormEvent<HTMLInputElement>) {
        setUserdata({
            ...userdata,
            [event.currentTarget.name] : event.currentTarget.value,
        })
    }

    useEffect(() => {
        if(userdata.password && userdata.passwordCheck){
            if(userdata.password === userdata.passwordCheck){
                setPasswordMatch('일치')
            }
            else {
                setPasswordMatch('불일치')
            }
        }
        else {
            setPasswordMatch('')
        }
    }, [userdata.password, userdata.passwordCheck])

    function checkEmailOverlap (event:React.MouseEvent<HTMLButtonElement>) {
        // 아직 안만듬.
        axios({
            method: "GET",
            url : serverUrl + "몰라/",
            data : {'email' : userdata.email}
        })
        .then(response => {
            console.log(response)
        })
        .catch(error => console.error(error))
    }

    function handleSubmit (event:React.FormEvent<HTMLFormElement>){
        event.preventDefault()
        axios({
            method: "POST",
            url: serverUrl + "regist/",
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            data: {
                'email': userdata.email,
                'password': userdata.password,
                'nickname': userdata.nickname
            }
        })
        .then(response => {
            console.log(response)
            
        })
        .catch(error => console.error(error))
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
            <span>{passwordMatch}</span>

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