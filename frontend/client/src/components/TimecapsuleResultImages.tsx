import React, { useEffect, useState } from "react"
import { styled } from "styled-components"
import Modal from "react-modal"
import { useSelector } from "react-redux"
import { RootState } from "../store/Store"
import axios from "axios"
import { useParams } from "react-router-dom"
import { motion } from "framer-motion"

interface cardType {
  userNo: string
  imagePath: string
}

const TimecapsuleResultImages = function () {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedImageUrl, setSelectedImageUrl] = useState("")
  const token = useSelector((state: RootState) => state.auth.accessToken)
  const [cardList, setCardList] = useState<cardType[] | null>(null)
  const { capsuleId } = useParams()

  const handleImageClick = (imgUrl: string) => {
    setSelectedImageUrl(imgUrl)
    setModalOpen(true)
  }

  const handleClose = () => {
    setSelectedImageUrl("")
    setModalOpen(false)
  }

  useEffect(() => {
    console.log("token", token)
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
        console.log(
          "카드카듴다ㅡㅋ닼듴다ㅡㅋ다ㅡㅋ다ㅡ",
          response.data.data.cardList
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
              onClick={() => handleImageClick(img.imagePath)}
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
