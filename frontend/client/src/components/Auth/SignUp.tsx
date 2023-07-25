import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { styled } from 'styled-components'
import axios from 'axios'
import { serverUrl } from '../../urls'
import { Link } from 'react-router-dom'
import tw from 'tailwind-styled-components'

const Form = styled.form`
    display: flex;
    flex-wrap: wrap;
    margin-left: auto;
    margin-right: auto;
`

const InputCSS = tw.input`
    bg-transparent
    border-b-2
    border-b-white-500
    my-2
    focus:outline-none
`

export const SignUp = function () {
    const navigate = useNavigate()
    const [userdata, setUserdata] = useState({
        email: '',
        userPw: '',
        userPwCheck: '',
        nickname: '',
        profileImage: '',
    })
    const [userPwMatch, setuserPwMatch] = useState('')
    const [selectedImage, setSelectedImage] = useState<string | null>(null)

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0]

        setUserdata({
            ...userdata,
            [event.currentTarget.name]: event.currentTarget.value,
        })
        if (file) {
            setUserdata({
                ...userdata,
            })
            const reader = new FileReader()
            reader.onloadend = () => {
                setSelectedImage(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    useEffect(() => {
        if (userdata.userPw && userdata.userPwCheck) {
            if (userdata.userPw === userdata.userPwCheck) {
                setuserPwMatch('일치')
            } else {
                setuserPwMatch('불일치')
            }
        } else {
            setuserPwMatch('')
        }
    }, [userdata.userPw, userdata.userPwCheck])

    function imgChange() {
        const fileinput = document.getElementById('profileImage') as HTMLInputElement
        fileinput.click()
    }

    function checkEmailOverlap(event: React.MouseEvent<HTMLButtonElement>) {
        console.log(userdata.email)

        axios({
            method: 'POST',
            url: serverUrl + 'user/email-check',
            data: { email: userdata.email },
        })
            .then((response) => {
                console.log(response)
            })
            .catch((error) => console.error(error))
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const filedata = document.getElementById('profileImage') as HTMLInputElement
        const data = new FormData()
        const userform = {
            email: userdata.email,
            userPw: userdata.userPw,
            nickname: userdata.nickname,
        }
        data.append('user', new Blob([JSON.stringify(userform)], { type: 'application/json' }))
        if (filedata?.files && filedata.files.length > 0) {
            data.append('profileImage', filedata.files[0])
        } else {
            data.append('profileImage', new Blob())
        }

        if (!userdata.email) {
            alert('이메일을 입력해주세요.')
        } else if (!userdata.nickname) {
            alert('닉네임을 입력해주세요.')
        } else if (!userdata.userPw) {
            alert('비밀번호를 입력해주세요.')
        } else if (userdata.userPw !== userdata.userPwCheck) {
            alert('비밀번호가 일치하지 않습니다.')
        } else {
            axios({
                method: 'POST',
                url: serverUrl + 'user/regist',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                data: data,
            })
                .then((res) => {
                    navigate('/login')
                })
                .catch((error) => console.error(error))
        }
    }

    return (
        <div className="grid grid-cols-1 w-48 mx-auto mt-5 text-white">
            <Link to={'/login'} style={{ fontSize: '30px', color: 'white' }}>
                <svg
                    className="w-6 h-6 text-black-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 8 14"
                >
                    <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M7 1 1.3 6.326a.91.91 0 0 0 0 1.348L7 13"
                    />
                </svg>
            </Link>
            <button
                className="p-2 px-4 text-sm rounded-full shadow-md bg-gray-500 w-24 relative top-40 left-24"
                onClick={checkEmailOverlap}
            >
                중복확인
            </button>
            <Form className="grid grid-cols-1 w-full mx-auto" onSubmit={handleSubmit}>
                <div style={{ margin: 'auto' }}>
                    <img
                        style={{ backgroundColor: '#AEB8E2', borderRadius: '50%' }}
                        src={selectedImage ? selectedImage : '/defalutprofile.png'}
                        width={100}
                        height={100}
                        alt="profile"
                    />
                    <img
                        src="/profilesetting.png"
                        alt="a"
                        width={30}
                        style={{ position: 'relative', top: '-30px', left: '70px' }}
                        onClick={imgChange}
                    />
                </div>
                <input id="profileImage" name="profileImage" type="file" className="hidden" onChange={handleChange} />

                <p className="grid grid-cols-2 items-center">
                    <span>이메일</span>
                </p>
                <InputCSS name="email" type="email" value={userdata.email} onChange={handleChange} />

                <p>
                    닉네임<span style={{ color: 'gray', fontSize: '8px', marginLeft: '3px' }}>최대 10자</span>{' '}
                </p>
                <InputCSS name="nickname" type="text" value={userdata.nickname} onChange={handleChange} />

                <p>비밀번호</p>
                <InputCSS name="userPw" type="password" value={userdata.userPw} onChange={handleChange} />

                <p>비밀번호 확인</p>
                <InputCSS name="userPwCheck" type="password" value={userdata.userPwCheck} onChange={handleChange} />
                <p>{userPwMatch}</p>

                <button
                    className="p-2 px-4 text-sm rounded-full shadow-md w-full mx-auto"
                    style={{ backgroundColor: '#EFE0F4', color: 'black' }}
                >
                    확인
                </button>
            </Form>
        </div>
    )
}
