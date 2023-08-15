import React, { useEffect, useState } from "react"
import "../index.css"
import tw from "tailwind-styled-components"
import { styled } from "styled-components"
import { useNavigate } from "react-router"
import { SubHeader } from "./inc/SubHeader"
import axios from "axios"
import { RootState } from "../store/Store"
import { useSelector } from "react-redux"
import Modal from "react-modal"
import toast, { Toaster } from "react-hot-toast"

interface CapsuleDataType {
  timecapsuleNo: number
  type: string
  title: string
  startDate: string
  endDate: string // GOAL일 때는 오픈한 시간
  capsuleIconNo: number
  goalCard: number
}

const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${(props) => props.theme.colorCommon};
  font-family: "Pretendard";
`
const DateDiv = styled.div`
  color: ${(props) => props.theme.colorCommon};
`

const Title = tw.div`
    mt-14
    text-xl
    font-normal
`

const Card = styled.div`
  display: flex;
  width: 318px;
  height: 126px;
  background-color: rgba(251, 248, 252, 0.1);
  border-radius: 30px;
  margin-top: 30px;
  align-items: center;
  &:hover {
    transition: 0.2s;
    transform: scale(1.05);
  }
`

const CapsuleImg = styled.div<{ capsuleNum: string }>`
  position: relative;
  background-image: url(${(props) =>
    props.theme["capsule" + props.capsuleNum]});
  background-repeat: no-repeat;
  background-size: cover;
  width: 87px;
  height: 87px;
  margin-left: 20px;
`

const CapsuleState = styled.div`
  font-size: 20px;
  display: flex;
  justify-content: space-between;
`

const CapsuleTitle = styled.div`
  width: 165px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  word-break: break-all;
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

const SavedTimecapsule = function () {
  const token = useSelector((state: RootState) => state.auth.accessToken)
  const [capsuleList, setCapsuleList] = useState<CapsuleDataType[]>([])
  const navigate = useNavigate()
  const [deleteNo, setDeleteNo] = useState(123456789)

  const [modalIsOpen, setIsOpen] = React.useState(false)

  function openModal() {
    setIsOpen(true)
  }

  function closeModal() {
    setIsOpen(false)
  }

  const handleDeleteClick = (event: React.MouseEvent, capsuleNo: number) => {
    event.stopPropagation() // 이벤트 버블링 막음
    setDeleteNo(capsuleNo)
    openModal()
  }

  const handleCloseModal = (event: React.MouseEvent) => {
    event.stopPropagation() // 이벤트 버블링 막음
    closeModal()
  }

  const handleDeleteConfirm = (event: React.MouseEvent, capsuleNo: number) => {
    event.stopPropagation() // 이벤트 버블링 막음
    savedCapsuleDelete(capsuleNo) // 타임캡슐 삭제
    closeModal() // 모달 닫기
  }

  const savedCapsuleDelete = async (capsuleNo: number) => {
    try {
      const response = await axios({
        method: "PATCH",
        url: process.env.REACT_APP_SERVER_URL + "timecapsule/exit",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        data: {
          timecapsuleNo: capsuleNo + "",
        },
      })
      if (response.data.code === 200) {
        window.location.reload()
        // 새로고침 추가하기
      } else if (response.data.code === 404) {
        toast("타임캡슐이 존재하지 않습니다.")
      } else if (response.data.code === 401) {
        toast("토큰 만료")
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios({
          method: "GET",
          url: process.env.REACT_APP_SERVER_URL + "timecapsule/store/list",
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        setCapsuleList(response.data.data.timecapsuleList)
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])

  return (
    <>
      <Toaster toastOptions={{ duration: 1000 }} />
      <SubHeader />
      <Box>
        <Title>저장된 타임캡슐</Title>
        {capsuleList.map((capsule) => (
          <div>
            <Card
              key={capsule.timecapsuleNo}
              onClick={() => {
                navigate(`/timecapsule/result/${capsule.timecapsuleNo}`)
              }}
            >
              <CapsuleImg capsuleNum={capsule.capsuleIconNo.toString()} />
              <div className="ml-2">
                <CapsuleState>
                  <div>
                    {calculateDday(capsule.startDate, capsule.endDate)}
                    <span className="font-light opacity-75">간의 기록</span>
                  </div>
                  <img
                    onClick={(e) => handleDeleteClick(e, capsule.timecapsuleNo)}
                    src="../../assets/icons/bin.png"
                    alt="bin"
                    style={{ width: "20px", height: "20.5px" }}
                  />
                </CapsuleState>

                <DateDiv
                  className="text-sm font-thin"
                  style={{ opacity: "56%" }}
                >
                  {capsule.startDate.slice(0, 10).split("-").join(".")} ~{" "}
                  {capsule.endDate.slice(0, 10).split("-").join(".")}
                </DateDiv>

                <CapsuleTitle>{capsule.title}</CapsuleTitle>
              </div>
            </Card>
          </div>
        ))}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="DeleteModal"
        >
          <ModalContent>
            <ModalTitle className="my-2">정말 삭제하시겠어요?</ModalTitle>
            <div>삭제하면 타임캡슐이 사라져요.</div>
            <div className="mt-2">
              <FileCencelBtn type="button" onClick={handleCloseModal}>
                취소
              </FileCencelBtn>
              <FileSubmitBtn onClick={(e) => handleDeleteConfirm(e, deleteNo)}>
                삭제
              </FileSubmitBtn>
            </div>
          </ModalContent>
        </Modal>
      </Box>
    </>
  )
}

const calculateDday = (startDate: string, endDate: string) => {
  const startDateString = startDate.slice(0, 10)
  const endDateString = endDate.slice(0, 10)

  const dday = calculateDateDifference(startDateString, endDateString)
  const ddayPrint = dday + "일"
  return ddayPrint
}

const calculateDateDifference = (startDate: string, endDate: string) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const differenceInTime = end.getTime() - start.getTime()
  const differenceInDays = differenceInTime / (1000 * 3600 * 24) // Convert milliseconds to days
  return differenceInDays
}

export default SavedTimecapsule
