import React, { useEffect, useState } from "react"
import { styled } from "styled-components"
import Modal from "react-modal"
import { useSelector } from "react-redux"
import { RootState } from "../store/Store"
import axios from "axios"
import { useParams } from "react-router-dom"
import { motion } from "framer-motion"
import toast, { Toaster } from "react-hot-toast"

interface cardType {
  userNo: string
  imagePath: string
  timecapsuleCardNo: string
}

const TimecapsuleResultImages = function () {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedImageUrl, setSelectedImageUrl] = useState("")
  const token = useSelector((state: RootState) => state.auth.accessToken)
  const [cardList, setCardList] = useState<cardType[] | null>(null)
  const { capsuleId } = useParams()
  const [selectedImgNo, setSelectedImgNo] = useState("")

  const handleImageClick = (imgUrl: string, imgNo: string) => {
    setSelectedImageUrl(imgUrl)
    setSelectedImgNo(imgNo)
    setModalOpen(true)
  }

  const handleClose = () => {
    setSelectedImageUrl("")
    setModalOpen(false)
  }

  const getCardImg = async (imgNo: string) => {
    try {
      const response = await axios({
        method: "GET",
        url:
          process.env.REACT_APP_SERVER_URL +
          `s3/download/timecapsule/${capsuleId}/timecapsule-card/${imgNo}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        responseType: "blob",
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", "image.jpg") // 다운로드 받을 때의 파일명을 설정합니다.
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link) // 링크를 바로 제거합니다.
      if (response.data.code === 200) {
      } else if (response.data.code === -6002) {
        toast("타임캡슐이 존재하지 않습니다.")
      } else if (response.data.code === -3018) {
        toast("해당 유저의 타임캡슐이 아닙니다.")
      } else if (response.data.code === -6008) {
        toast("삭제된 타임캡슐입니다.")
      } else if (response.data.code === -3020) {
        toast("아직 열지 않은 타임캡슐입니다.")
      } else if (response.data.code === -6005) {
        toast("작성된 카드가 없습니다.")
      } else if (response.data.code === -6014) {
        toast("해당 타임캡슐의 카드가 아닙니다.")
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const timecapsuleNo = capsuleId
        const response = await axios.get(
          process.env.REACT_APP_SERVER_URL +
            `timecapsule/cardlist?timecapsuleNo=${timecapsuleNo}`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        )
        setCardList(response.data.data.cardList)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ImgConainer>
        {cardList &&
          cardList?.length !== 0 &&
          cardList.map((img) => (
            <Image
              key={img.imagePath}
              onClick={() =>
                handleImageClick(img.imagePath, img.timecapsuleCardNo)
              }
            >
              <img src={img.imagePath} alt="" />
            </Image>
          ))}
        <Modal
          isOpen={modalOpen}
          onRequestClose={handleClose}
          style={customStyles}
        >
          <div>
            <DownloadIcon
              src="../../assets/icons/download.png"
              alt="download"
              onClick={() => getCardImg(selectedImgNo)}
            />
            <img className="w-96" src={selectedImageUrl} alt="Selected" />
          </div>
        </Modal>
      </ImgConainer>
    </motion.div>
  )
}

const ImgConainer = styled.div`
  display: flex;
  align-content: flex-start;
  flex-wrap: wrap;
  height: 400px;
  overflow: scroll;
  width: 19rem;
  margin-left: 3.7px;
`
const Image = styled.div`
  margin: 0.5px;
  width: 99px;
`

const DownloadIcon = styled.img`
  position: absolute;
  top: -5px;
  right: 20px;
  width: 23px;
`

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    width: "330px",
    border: "0px",
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
}
export default TimecapsuleResultImages
