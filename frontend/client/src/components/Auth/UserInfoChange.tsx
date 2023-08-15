import React, { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../store/Store"
import { DELETE_TOKEN, DELETE_USER, SET_USER } from "../../store/Auth"
import Modal from "react-modal"
import { DELETE_TIMECAPSULE } from "../../store/Timecapsule"
import { SET_THEME } from "../../store/Theme"
import { removeCookieToken } from "../../store/Cookie"
import styled from "styled-components"
import { SubHeader } from "../inc/SubHeader"
import toast, { Toaster } from "react-hot-toast"
import { motion } from "framer-motion"

const FILE_SIZE_LIMIT_MB = 1 // 1MB 미만의 사진만 가능합니다.
const FILE_SIZE_LIMIT_BYTES = FILE_SIZE_LIMIT_MB * 1024 * 1024 // 바이트 변환

const isFileSizeValid = (file: File | null) => {
  return file !== null && file.size <= FILE_SIZE_LIMIT_BYTES
}
// 닉네임 정규식
const nicknameRegex = /^(?=.*[a-zA-Z가-힣0-9]).{2,15}$/

// 비밀번호 정규식
const passwordRegex = /^(?=.*[a-zA-Z])[!@#$%^*+=-]?(?=.*[0-9]).{5,25}$/

// 파일(사진) 확장자 제한
const allowedExtensions = [".jpg", ".jpeg", ".png"]

const isAllowFiles = (file: File) => {
  const fileExtension = file.name.substring(file.name.lastIndexOf("."))
  if (allowedExtensions.includes(fileExtension.toLowerCase())) {
    return true
  }
  return false
}

const Box = styled.div`
  display: flex;
  flex-direction: column;
  font-family: "Pretendard";
  color: ${(props) => props.theme.colorCommon};
  align-items: center;
`

const Content = styled.div`
  font-size: 1.25rem;
  font-weight: 300;
  span {
    opacity: 0.47;
    font-size: 14px;
    color: ${(props) => props.theme.colorCommon};
    margin-left: 15px;
  }
`

const InputText = styled.input`
  background-color: rgb(255, 255, 255, 0);
  border-bottom: 2px solid ${(props) => props.theme.colorCommon};
  height: 50px;
  outline: none;
  font-weight: 200;
`

const MakeCapsuleButton = styled.button`
  border-radius: 30px;
  font-family: "pretendard";
  font-size: 20px;
  font-weight: 400;
  box-shadow: 0px 4px 4px ${(props) => props.theme.colorShadow};
  color: ${(props) => props.theme.color900};
  background-color: ${(props) => props.theme.color100};
  &:hover {
    transition: 0.2s;
    transform: scale(0.95);
    color: ${(props) => props.theme.color100};
    background-color: ${(props) => props.theme.color700};
  }
`

const UnregisterBtn = styled.div`
  font-size: 16px;
  text-decoration: underline;
  opacity: 60%;
`

const ModalContent = styled.div`
  color: ${(props) => props.theme.color900};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 13px;
`

const ModalTitle = styled.div`
  font-size: 20px;
  font-weight: 700;

  span {
    color: ${(props) => props.theme.color500};
  }
`

const FileCencelBtn = styled.button`
  width: 76px;
  height: 25px;
  border-radius: 30px;
  background-color: rgb(255, 255, 255, 0.05);
  color: ${(props) => props.theme.color900};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  font-size: 16px;
  font-weight: 500;
  margin: 10px 13px;
`

const FileSubmitBtn = styled(FileCencelBtn)`
  background-color: ${(props) => props.theme.color500};
`

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    borderRadius: "20px",
    fontFamily: "Pretendard",
  },
  overlay: {
    zIndex: 2,
    backgroundColor: "rgba(0, 0, 0, 0.733)",
  },
}

export const UserInfoChange = () => {
  const navigate = useNavigate()
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const imageRef = useRef<HTMLInputElement>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(
    useSelector((state: RootState) => state.auth.userInfo.profileImage)
  )
  const [userdata, setUserdata] = useState({
    userPw: "",
    userPwCheck: "",
    nickname: useSelector((state: RootState) => state.auth.userInfo.nickname),
    accountType: useSelector(
      (state: RootState) => state.auth.userInfo.accountType
    ),
  })
  const [isChangePassword, setIsChangePassword] = useState(false)
  const [userNicknameCondition, setUserNicknameCondition] = useState(0)
  const [userPwCondition, setUserPwCondition] = useState(0)
  const [userPwMatch, setuserPwMatch] = useState(0)
  let token = useSelector((state: RootState) => state.auth.accessToken)
  const [modalOpen, setModalOpen] = useState(false)
  const dispatch = useDispatch()

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
    if (file) {
      if (!isFileSizeValid(file)) {
        toast(`파일 크기는 최대 ${FILE_SIZE_LIMIT_MB}MB만 가능합니다.`)
        if (imageRef.current) {
          imageRef.current.value = ""
        }
      } else if (!isAllowFiles(file)) {
        toast("파일 확장자는 .jpg, .jpeg, .png만 가능합니다.")
        if (imageRef.current) {
          imageRef.current.value = ""
        }
      } else {
        setProfileImage(file)
        const reader = new FileReader()
        reader.onloadend = () => {
          setSelectedImage(reader.result as string)
        }
        reader.readAsDataURL(file)
      }
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
      toast("닉네임을 입력해주세요.")
    } else if (userdata.nickname && userNicknameCondition !== 1) {
      toast("닉네임이 유효하지 않습니다.")
    } else if (isChangePassword && !userdata.userPw) {
      toast("비밀번호를 입력해주세요.")
    } else if (isChangePassword && userdata.userPw && userPwCondition !== 1) {
      toast("비밀번호가 유효하지 않습니다.")
    } else if (isChangePassword && userdata.userPw !== userdata.userPwCheck) {
      toast("비밀번호가 일치하지 않습니다.")
    } else {
      axios({
        method: "PATCH",
        url: process.env.REACT_APP_SERVER_URL + "user/info",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + token,
        },
        data: data,
      })
        .then((response) => {
          toast(response.data.message)
          const userInfo = response.data.data
          dispatch(SET_USER(userInfo))
          navigate("/main")
        })
        .catch((error) => console.error(error))
    }
  }

  function ModalOpen() {
    setModalOpen(true)
  }

  function ModalClose() {
    setModalOpen(false)
  }

  function handleUserDelete(event: React.MouseEvent<HTMLButtonElement>) {
    axios({
      method: "PATCH",
      url: process.env.REACT_APP_SERVER_URL + "user/delete",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => {
        toast(response.data.message)
        if (response.data.code === 200) {
          dispatch(DELETE_USER())
          dispatch(DELETE_TOKEN())
          dispatch(DELETE_TIMECAPSULE())
          dispatch(SET_THEME(0))
          removeCookieToken()
          navigate("/login")
        }
      })
      .catch((error) => console.error(error))
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Toaster toastOptions={{ duration: 1000 }} />
      <SubHeader />
      <Box className="m-auto">
        <form className="w-80 mt-10" onSubmit={handleSubmit}>
          <img
            className="mx-auto"
            style={{
              backgroundColor: "#AEB8E2",
              borderRadius: "50%",
              width: "100px",
              height: "100px",
            }}
            src={selectedImage ? selectedImage : "/defalutprofile.png"}
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
          <input
            id="profileImage"
            name="profileImage"
            type="file"
            className="hidden"
            onChange={handleImageChange}
            ref={imageRef}
          />
          <Content>닉네임</Content>
          <InputText
            className="w-80"
            name="nickname"
            type="text"
            value={userdata.nickname}
            onChange={handleChange}
          />
          <div>
            {userNicknameCondition === 2 ? (
              <div className="text-red-300 w-full mt-1">
                영문, 한글, 숫자로 2-15자이어야 합니다.
              </div>
            ) : userNicknameCondition === 1 ? (
              <div className="text-emerald-300 w-full mt-1">유효한 닉네임</div>
            ) : (
              <div className="h-7"></div>
            )}
          </div>
          {userdata.accountType === "ORIGIN" && (
            <div
              className="mt-6 flex items-center"
              onClick={() => {
                setIsChangePassword(!isChangePassword)
              }}
            >
              {isChangePassword ? (
                <img
                  src="../../../assets/icons/checkbox.png"
                  alt="checkbox"
                  width="20px"
                  height="20px"
                />
              ) : (
                <img
                  src="../../../assets/icons/checkbox_none.png"
                  alt="checkbox_none"
                  width="20px"
                  height="20px"
                />
              )}
              <span className="ml-2" style={{ fontSize: "20px" }}>
                비밀번호 변경하기
              </span>
            </div>
          )}
          <div className="mt-6">
            {isChangePassword && (
              <div>
                <Content>새 비밀번호</Content>
                <InputText
                  className="w-80"
                  name="userPw"
                  type="password"
                  value={userdata.userPw}
                  onChange={handleChange}
                />
                {userPwCondition === 2 ? (
                  <p className="text-red-300 w-full mt-1">
                    특수, 영문, 숫자 조합으로 5-25자이어야 합니다.
                  </p>
                ) : userPwCondition === 1 ? (
                  <p className="text-emerald-300 w-full mt-1">
                    유효한 비밀번호
                  </p>
                ) : (
                  <div className="h-7"></div>
                )}
                <Content className="mt-6">비밀번호 확인</Content>
                <InputText
                  className="w-80"
                  name="userPwCheck"
                  type="password"
                  value={userdata.userPwCheck}
                  onChange={handleChange}
                />
                {userPwMatch === 1 ? (
                  <p className="text-red-300 mt-1">비밀번호 불일치</p>
                ) : userPwMatch === 2 ? (
                  <p className="text-emerald-300 mt-1">비밀번호 일치</p>
                ) : (
                  <div className="h-7"></div>
                )}
              </div>
            )}
          </div>
          <MakeCapsuleButton className="mt-12 w-60 h-14 m-auto bottom-0 flex items-center justify-center">
            확인
          </MakeCapsuleButton>
        </form>
        <UnregisterBtn
          className="font-light text-gray-300 mt-5"
          onClick={ModalOpen}
        >
          회원 탈퇴
        </UnregisterBtn>
        <Modal
          isOpen={modalOpen}
          onRequestClose={ModalClose}
          style={customStyles}
          shouldCloseOnOverlayClick={false}
        >
          <ModalContent>
            <ModalTitle className="my-2">정말 탈퇴하시겠어요?</ModalTitle>
            <div className="text-center">
              이후에 같은 아이디로는 <br /> 다시 회원가입 할 수 없습니다.
            </div>
            <div className="mt-2">
              <FileCencelBtn type="button" onClick={ModalClose}>
                취소
              </FileCencelBtn>
              <FileSubmitBtn onClick={handleUserDelete}>탈퇴</FileSubmitBtn>
            </div>
          </ModalContent>
        </Modal>
      </Box>
    </motion.div>
  )
}
