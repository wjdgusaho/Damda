import React, { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router"
import { styled } from "styled-components"
import axios from "axios"
import { serverUrl } from "../../urls"
import { Link } from "react-router-dom"
import tw from "tailwind-styled-components"
import Modal from "react-modal"

const FILE_SIZE_LIMIT_MB = 1 // 1MB 미만의 사진만 가능합니다.
const FILE_SIZE_LIMIT_BYTES = FILE_SIZE_LIMIT_MB * 1024 * 1024 // 바이트 변환

const isFileSizeValid = (file: File | null) => {
  return file !== null && file.size <= FILE_SIZE_LIMIT_BYTES
}
// 닉네임 정규식
const nicknameRegex = /^(?=.*[a-zA-Z가-힣0-9]).{2,15}$/

// 비밀번호 정규식
const passwordRegex = /^(?=.*[a-zA-Z])[!@#$%^*+=-]?(?=.*[0-9]).{5,25}$/

const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  margin-left: auto;
  margin-right: auto;
`

const ModalForm = styled(Form)`
  display: flex;
  flex-direction: column;
`

const InputCSS = tw.input`
    w-full
    bg-transparent
    border-b-2
    border-b-white-500
    my-2
    focus:outline-none
`
const successCode = Math.floor(Math.random() * 10000)

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "50%",
    borderRadius: "20px",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.733)",
  },
}

const ModalButton = styled.button`
  font-family: "pretendard";
  font-weight: 400;
  font-size: 18px;
  width: 80px;
  height: 26px;
  border-radius: 30px;
  text-align: center;
  box-shadow: 0px 4px 4px ${(props) => props.theme.colorShadow};
  color: #000000b1;
  cursor: pointer;
`

export const SignUp = function () {
  const navigate = useNavigate()
  const [userdata, setUserdata] = useState({
    email: "",
    userPw: "",
    userPwCheck: "",
    nickname: "",
  })
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const imageRef = useRef<HTMLInputElement>(null)
  const [userNicknameCondition, setUserNicknameCondition] = useState(0)
  const [userPwCondition, setUserPwCondition] = useState(0)
  const [userPwMatch, setuserPwMatch] = useState(0)
  const [userEmailMessage, setuserEmailMessage] = useState("")
  const [userEmailMatch, setuserEmailMatch] = useState(0)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [getCode, setGetCode] = useState(false)
  const [userCode, setUserCode] = useState("")

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setUserdata({
      ...userdata,
      [event.currentTarget.name]: event.currentTarget.value,
    })
  }
  function handleCodeChange(event: React.ChangeEvent<HTMLInputElement>) {
    setUserCode(event.currentTarget.value)
  }

  function handleClose() {
    setGetCode(false)
  }

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

  useEffect(() => {
    if (userEmailMatch) {
      setuserEmailMatch(0)
    }
  }, [userdata.email])

  function imgChange() {
    const fileinput = document.getElementById(
      "profileImage"
    ) as HTMLInputElement
    fileinput.click()
  }

  async function sleep(sec: number) {
    return new Promise<void>((resolve) => setTimeout(resolve, sec * 1000))
  }
  let seconds = 0

  function startCountdown(minute: number) {
    seconds = minute * 60

    const interval = setInterval(() => {
      const countdownElement = document.querySelector(
        "#countdown"
      ) as HTMLSpanElement
      const minuteRemaining = Math.floor(seconds / 60)
      const secondRemaining = seconds % 60

      if (countdownElement) {
        countdownElement.textContent =
          "남은시간 " +
          `${String(minuteRemaining).padStart(2, "0")}:${String(
            secondRemaining
          ).padStart(2, "0")}`
        if (seconds < 120) {
          countdownElement.style.color = "red"
        }
        if (seconds === 0) {
          countdownElement.textContent = "인증번호 만료"
        }
      }

      if (seconds === 0) {
        clearInterval(interval)
        setuserEmailMatch(0)
      }

      seconds--
    }, 1000)
  }

  function handleSubmitCode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if(!userCode){
      alert('인증번호를 입력해주세요.')
    }
    else if(userCode && seconds <= 0){
      alert('인증번호가 만료되었습니다. 재발급 요청을 해주세요.')
    }
    else{
      axios({
        method: "POST",
        url: serverUrl + "user/check-email",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          email: userdata.email,
          code: userCode,
        },
      })
      .then((response) => {
        const code = response.data.code
        alert(response.data.message)
        if (code === 200) {
          setGetCode(false)
          setuserEmailMatch(3)
          setUserCode("success" + successCode.toString())
        }
      })
      .catch((error) => {
        console.error(error)
      })
    }
  }

  function checkEmailOverlap(event: React.MouseEvent<HTMLButtonElement>) {
    if (!userdata.email) {
      setuserEmailMessage("이메일을 입력해주세요.")
    } else if (
      !userdata.email.includes("@") ||
      userdata.email.search("@") + 1 === userdata.email.length ||
      userdata.email.search("@") === 0
    ) {
      setuserEmailMessage("이메일 형식으로 입력해주세요.")
    } else {
      axios({
        method: "POST",
        url: serverUrl + "user/send-email",
        data: { email: userdata.email },
      })
        .then(async (response) => {
          if(response.data.code === 200){
            setuserEmailMessage("")
            setuserEmailMatch(2)
            setGetCode(true)
            await sleep(1)
            startCountdown(10)
          }
          else {
            setuserEmailMatch(1)
            alert(response.data.message)
          }
        })
        .catch((error) => {
          alert("중복확인에 실패하셨습니다. 잠시 후 다시 시도해주세요.")
        })
    }
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

    if (!userdata.email) {
      alert("이메일을 입력해주세요.")
    } else if (userdata.email && userEmailMatch < 2) {
      alert("이메일 중복확인을 해주세요.")
    } else if (
      userdata.email &&
      userEmailMatch !== 3 &&
      userCode !== "success" + successCode.toString()
    ) {
      alert("이메일 인증이 되지 않았습니다.")
    } else if (!userdata.nickname) {
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
        method: "POST",
        url: serverUrl + "user/regist",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: data,
      })
        .then(() => {
          navigate("/login")
        })
        .catch(() => {
          alert("회원가입에 실패하셨습니다. 잠시 후 다시 시도해주세요.")
        })
    }
  }

  return (
    <div className="grid grid-cols-1 w-72 mx-auto mt-5 text-white">
      <Link to={"/login"} style={{ fontSize: "30px", color: "white" }}>
        <svg
          className="w-6 h-6 text-black-800 dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 8 14"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M7 1 1.3 6.326a.91.91 0 0 0 0 1.348L7 13"
          />
        </svg>
      </Link>
      {userEmailMatch === 3 ? (
        <div className="p-2 px-4 text-sm text-green-500 w-24 relative top-40 left-48">
          인증완료
        </div>
      ) : userEmailMatch === 2 ? (
        <button
          className="p-2 px-4 text-sm rounded-full shadow-md bg-gray-500 w-28 relative top-40 left-48"
          onClick={() => {
            setGetCode(true)
          }}
        >
          이메일인증
        </button>
      ) : userEmailMatch === 1 ? (
        <button
          className="p-2 px-4 text-sm rounded-full shadow-md bg-red-500 w-24 relative top-40 left-48"
          onClick={checkEmailOverlap}
        >
          사용불가
        </button>
      ) : userEmailMatch === 0 ? (
        <button
          className="p-2 px-4 text-sm rounded-full shadow-md bg-gray-500 w-24 relative top-40 left-48"
          onClick={checkEmailOverlap}
        >
          중복확인
        </button>
      ) : (
        <div></div>
      )}

      <Modal
        isOpen={getCode}
        onRequestClose={handleClose}
        shouldCloseOnOverlayClick={false}
        style={customStyles}
      >
        <ModalForm onSubmit={handleSubmitCode}>
          <p className="grid grid-cols-2 justify-between">
            인증번호를 입력하세요.
            <span id="countdown" className="text-end">
              남은시간 10:00
            </span>
          </p>
          <input
            className="bg-transparent focus:outline-none border-b-2 ml-2"
            type="text"
            onChange={handleCodeChange}
          />
          <div className="flex justify-between mt-5">
            <ModalButton onSubmit={() => handleSubmitCode}>확인</ModalButton>
            <ModalButton onClick={() => handleClose()}>닫기</ModalButton>
          </div>
        </ModalForm>
      </Modal>
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

        <p className="grid grid-cols-1 items-center">
          <span>이메일</span>
        </p>
        <InputCSS
          name="email"
          type="email"
          value={userdata.email}
          onChange={handleChange}
        />
        <p className="text-red-500 w-full">{userEmailMessage}</p>

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

        <p>비밀번호</p>
        <span style={{ color: "gray", fontSize: "8px", marginLeft: "3px" }}>
          5~25자, 영문숫자 필수, 특수문자(!@#$%^*+=-) 가능
        </span>
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
          className="p-2 px-4 text-sm rounded-full shadow-md w-48 mt-10 mx-auto"
          style={{ backgroundColor: "#EFE0F4", color: "black" }}
        >
          확인
        </button>
      </Form>
    </div>
  )
}
