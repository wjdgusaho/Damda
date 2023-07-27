import React, { useState, useRef, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import tw from "tailwind-styled-components"
import { serverUrl } from "../../urls"
import axios from "axios"

const FILE_SIZE_LIMIT_MB = 1 // 1MB 미만의 사진만 가능합니다.
const FILE_SIZE_LIMIT_BYTES = FILE_SIZE_LIMIT_MB * 1024 * 1024 // 바이트 변환

const isFileSizeValid = (file: File | null) => {
  return file !== null && file.size <= FILE_SIZE_LIMIT_BYTES
}
// 닉네임 정규식
const nicknameRegex = /^(?=.*[a-zA-Z가-힣0-9]).{2,15}$/

// 비밀번호 정규식
const passwordRegex = /^(?=.*[a-zA-Z])[!@#$%^*+=-]?(?=.*[0-9]).{5,25}$/

const Box = tw.div`
  flex
  justify-center
  mt-10
  mx-auto
  flex-col
  text-center
  w-96
`
const Form = tw.form`
  flex
  mx-auto
  flex-wrap
`

const InputCSS = tw.input`
    w-full
    bg-transparent
    border-b-2
    border-b-white-500
    my-2
    focus:outline-none
`

export const UserInfoChange = function () {
  const navigate = useNavigate()
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const imageRef = useRef<HTMLInputElement>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [userdata, setUserdata] = useState({
    email: "",
    userPw: "",
    userPwCheck: "",
    nickname: "",
  })
  const [userNicknameCondition, setUserNicknameCondition] = useState(0)
  const [userPwCondition, setUserPwCondition] = useState(0)
  const [userPwMatch, setuserPwMatch] = useState(0)

  useEffect(() => {
    if (userdata.nickname) {
      if (nicknameRegex.test(userdata.nickname)) {
        setUserNicknameCondition(1)
      } else {
        setUserNicknameCondition(2)
      }
    } else {
      setUserNicknameCondition(0)
    }
  }, [userdata.nickname])

  useEffect(() => {
    if (userdata.userPw) {
      if (passwordRegex.test(userdata.userPw)) {
        setUserPwCondition(1)
      } else {
        setUserPwCondition(2)
      }
    } else {
      setUserPwCondition(0)
    }

    if (userdata.userPw && userdata.userPwCheck) {
      if (userdata.userPw === userdata.userPwCheck) {
        setuserPwMatch(2)
      } else {
        setuserPwMatch(1)
      }
    } else {
      setuserPwMatch(0)
    }
  }, [userdata.userPw, userdata.userPwCheck])

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null
    if (file && isFileSizeValid(file)) {
      setProfileImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      if (imageRef.current) {
        imageRef.current.value = ""
      }
      setProfileImage(null)
      alert(`파일 크기는 최대 ${FILE_SIZE_LIMIT_MB}MB만 가능합니다.`)
    }
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setUserdata({
      ...userdata,
      [event.currentTarget.name]: event.currentTarget.value,
    })
  }

  function imgChange() {
    const fileinput = document.getElementById(
      "profileImage"
    ) as HTMLInputElement
    fileinput.click()
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData()
    const userform = {
      email: userdata.email,
      userPw: userdata.userPw,
      nickname: userdata.nickname,
    }
    data.append(
      "user",
      new Blob([JSON.stringify(userform)], { type: "application/json" })
    )
    if (profileImage) {
      data.append("profileImage", profileImage)
    } else {
      data.append("profileImage", new Blob())
    }

    if (!userdata.nickname) {
      alert("닉네임을 입력해주세요.")
    } else if (userdata.nickname && userNicknameCondition !== 1) {
      alert("닉네임이 유효하지 않습니다.")
    } else if (!userdata.userPw) {
      alert("비밀번호를 입력해주세요.")
    } else if (userdata.userPw && userPwCondition !== 1) {
      alert("비밀번호가 유효하지 않습니다.")
    } else if (userdata.userPw !== userdata.userPwCheck) {
      alert("비밀번호가 일치하지 않습니다.")
    } else {
      axios({
        method: "PATCH",
        url: serverUrl + "user/info",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: data,
      })
        .then(() => {
          navigate("/main")
        })
        .catch((error) => console.error(error))
    }
  }

  return (
    <div style={{ color: "#CFD4EE" }}>
      <div className="flex flex-initial justify-between w-96 mx-auto mt-10">
        <Link
          to={"/menu"}
          style={{ fontSize: "30px", color: "white", marginLeft: "30px" }}
        >
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
        <Link to={"/main"} className="grid grid-cols-2 text-center">
          <img
            style={{ marginLeft: "13px" }}
            src="/assets/icons/home.png"
            alt="home"
            width={25}
          />
          <p>홈으로</p>
        </Link>
      </div>
      <Form className="grid grid-cols-1 w-full mx-auto" onSubmit={handleSubmit}>
        <div className="w-full justify-center">
          <img
            className="mx-auto"
            style={{ backgroundColor: "#AEB8E2", borderRadius: "50%" }}
            src={selectedImage ? selectedImage : "/defalutprofile.png"}
            width={100}
            height={100}
            alt="profile"
          />
          <img
            className="mx-auto"
            src="/profilesetting.png"
            alt="a"
            width={30}
            style={{ position: "relative", top: "-30px", left: "30px" }}
            onClick={imgChange}
          />
        </div>
        <input
          id="profileImage"
          name="profileImage"
          type="file"
          className="hidden"
          onChange={handleImageChange}
          ref={imageRef}
        />

        <p>
          닉네임
          <span style={{ color: "gray", fontSize: "8px", marginLeft: "3px" }}>
            영문 2~15자
          </span>
        </p>
        <InputCSS
          name="nickname"
          type="text"
          value={userdata.nickname}
          onChange={handleChange}
        />
        {userNicknameCondition === 2 ? (
          <p className="text-red-500 w-full">
            닉네임은 영문, 한글, 숫자로 2-15자이어야 합니다.
          </p>
        ) : userNicknameCondition === 1 ? (
          <p className="text-green-500 w-full">유효한 닉네임</p>
        ) : (
          <></>
        )}

        <p>
          비밀번호
          <span style={{ color: "gray", fontSize: "8px", marginLeft: "3px" }}>
            5~25자, 영문숫자 필수, 특수문자(!@#$%^*+=-) 가능
          </span>
        </p>
        <InputCSS
          name="userPw"
          type="password"
          value={userdata.userPw}
          onChange={handleChange}
        />
        {userPwCondition === 2 ? (
          <p className="text-red-500 w-full">
            비밀번호는 특수, 영문, 숫자 조합으로 5-25자이어야 합니다.
          </p>
        ) : userPwCondition === 1 ? (
          <p className="text-green-500 w-full">유효한 비밀번호</p>
        ) : (
          <></>
        )}

        <p>비밀번호 확인</p>
        <InputCSS
          name="userPwCheck"
          type="password"
          value={userdata.userPwCheck}
          onChange={handleChange}
        />
        {userPwMatch === 1 ? (
          <p className="text-red-500">비밀번호 불일치</p>
        ) : userPwMatch === 2 ? (
          <p className="text-green-500">비밀번호 일치</p>
        ) : (
          <p></p>
        )}

        <button
          className="p-2 px-4 text-sm rounded-full shadow-md w-full mx-auto"
          style={{ backgroundColor: "#EFE0F4", color: "black" }}
        >
          확인
        </button>
      </Form>
    </div>
  )
}