import React, { useState } from "react"
import { styled } from "styled-components"
import Modal from "react-modal"
const imgList = [
  {
    url: "https://damda.s3.ap-northeast-2.amazonaws.com/timecapsule/152/card/0b2bb6a0-c6b8-4045-abd3-29c4bda33c1f.jpg",
  },
  {
    url: "https://damda.s3.ap-northeast-2.amazonaws.com/timecapsule/152/card/0b2bb6a0-c6b8-4045-abd3-29c4bda33c1f.jpg",
  },
  {
    url: "https://damda.s3.ap-northeast-2.amazonaws.com/timecapsule/152/card/0b2bb6a0-c6b8-4045-abd3-29c4bda33c1f.jpg",
  },
  {
    url: "https://damda.s3.ap-northeast-2.amazonaws.com/timecapsule/152/card/0b2bb6a0-c6b8-4045-abd3-29c4bda33c1f.jpg",
  },
  {
    url: "https://damda.s3.ap-northeast-2.amazonaws.com/timecapsule/152/card/0b2bb6a0-c6b8-4045-abd3-29c4bda33c1f.jpg",
  },
  {
    url: "https://damda.s3.ap-northeast-2.amazonaws.com/timecapsule/152/card/0b2bb6a0-c6b8-4045-abd3-29c4bda33c1f.jpg",
  },
  {
    url: "https://damda.s3.ap-northeast-2.amazonaws.com/timecapsule/152/card/0b2bb6a0-c6b8-4045-abd3-29c4bda33c1f.jpg",
  },
  {
    url: "https://damda.s3.ap-northeast-2.amazonaws.com/timecapsule/152/card/0b2bb6a0-c6b8-4045-abd3-29c4bda33c1f.jpg",
  },
  {
    url: "https://damda.s3.ap-northeast-2.amazonaws.com/timecapsule/152/card/0b2bb6a0-c6b8-4045-abd3-29c4bda33c1f.jpg",
  },
  {
    url: "https://damda.s3.ap-northeast-2.amazonaws.com/timecapsule/152/card/0b2bb6a0-c6b8-4045-abd3-29c4bda33c1f.jpg",
  },
  {
    url: "https://damda.s3.ap-northeast-2.amazonaws.com/timecapsule/152/card/0b2bb6a0-c6b8-4045-abd3-29c4bda33c1f.jpg",
  },
  {
    url: "https://damda.s3.ap-northeast-2.amazonaws.com/timecapsule/152/card/0b2bb6a0-c6b8-4045-abd3-29c4bda33c1f.jpg",
  },
  {
    url: "https://damda.s3.ap-northeast-2.amazonaws.com/timecapsule/152/card/0b2bb6a0-c6b8-4045-abd3-29c4bda33c1f.jpg",
  },
  {
    url: "https://damda.s3.ap-northeast-2.amazonaws.com/timecapsule/152/card/0b2bb6a0-c6b8-4045-abd3-29c4bda33c1f.jpg",
  },
  {
    url: "https://damda.s3.ap-northeast-2.amazonaws.com/timecapsule/152/card/0b2bb6a0-c6b8-4045-abd3-29c4bda33c1f.jpg",
  },
  {
    url: "https://damda.s3.ap-northeast-2.amazonaws.com/timecapsule/152/card/0b2bb6a0-c6b8-4045-abd3-29c4bda33c1f.jpg",
  },
]

const TimecapsuleResultImages = function () {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedImageUrl, setSelectedImageUrl] = useState("")
  const handleImageClick = (imgUrl: string) => {
    setSelectedImageUrl(imgUrl)
    setModalOpen(true)
  }

  const handleClose = () => {
    setSelectedImageUrl("")
    setModalOpen(false)
  }

  return (
    <ImgConainer>
      {imgList.map((img) => (
        <Image key={img.url} onClick={() => handleImageClick(img.url)}>
          <img src={img.url} alt="" />
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
  )
}

const ImgConainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  height: 400px;
  overflow: scroll;
  width: 19rem;
  margin-left: 2px;
`
const Image = styled.div`
  margin: 1px;
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
