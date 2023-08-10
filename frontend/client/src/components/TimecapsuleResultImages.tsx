import React from "react"
import { styled } from "styled-components"

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
  return (
    <ImgConainer>
      {imgList.map((img) => (
        <Image>
          <img src={img.url} alt="" />
        </Image>
      ))}
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
export default TimecapsuleResultImages
