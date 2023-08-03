import styled from "styled-components"
import React, { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"

const StickerContainer = (props: {
  countList: { no: number; url: string }[]
  onDeleteCardSticker: (no: number) => void // onDeleteCardSticker는 no를 인자로 받고 반환값이 없는 함수입니다.
}) => {
  const [selectedStickerIndex, setSelectedStickerIndex] = useState<number>(
    props.countList.length === 0 ? -1 : props.countList[0].no
  )

  const handleStickerClick = (index: number) => {
    setSelectedStickerIndex((prevIndex) => (prevIndex === index ? -1 : index))
  }

  // document 클릭 이벤트를 감지하여 스티커 외부를 클릭할 경우 선택된 스티커를 해제합니다.
  const handleDocumentClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    const stickerContainer = containerRef.current

    if (!stickerContainer?.contains(target)) {
      setSelectedStickerIndex(-1)
    }
  }

  // document 클릭 이벤트를 추가합니다.
  useEffect(() => {
    console.log("리스트변경!!!!")
    if (props.countList.length > 0) {
      const targetSticker = document.getElementById(
        "sticker" + (props.countList.length - 1)
      )
      if (targetSticker) {
        setTimeout(() => {
          targetSticker.click()
        }, 0)
      }
    }
  }, [props.countList])

  useEffect(() => {
    document.addEventListener("click", handleDocumentClick)
    return () => {
      document.removeEventListener("click", handleDocumentClick)
    }
  }, [])

  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={containerRef}>
      {props.countList &&
        props.countList.map((item, i) => (
          <StickerImg
            drag
            id={"sticker" + item.no}
            className={`w-16 h-16 absolute left-1/2 right-1/2 top-1/4 -ml-8 ${
              selectedStickerIndex === i ? "border border-black" : ""
            }`}
            key={i}
            stickerURL={item.url}
            onClick={() => handleStickerClick(i)}
          >
            {selectedStickerIndex === null ||
              (selectedStickerIndex === i && (
                <div>
                  <div
                    className="w-6 h-6 absolute right-0 top-0 -mt-3 -mr-3 rounded-full bg-red-500"
                    onClick={() => props.onDeleteCardSticker(item.no)}
                  ></div>
                  <div className="w-6 h-6 absolute right-0 bottom-0 -m-3 -mr-3 rounded-full bg-green-500"></div>
                </div>
              ))}
          </StickerImg>
        ))}
    </div>
  )
}

const StickerImg = styled(motion.button)<{ stickerURL: string }>`
  background-image: url(${(props) => props.stickerURL});
  background-repeat: no-repeat;
  background-size: cover;
`

export default StickerContainer
