import React, { useState } from "react"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { styled } from "styled-components"
import "../index.css"
import tw from "tailwind-styled-components"
import { useNavigate } from "react-router-dom"

const Container = styled.div`
  .slick-dots {
    button::before {
      opacity: 1;
      margin-top: 30px;
    }
  }
  .slick-dots li button:before {
    content: "";
    display: block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: ${(props) => props.theme.color50};
  }
  .slick-dots li.slick-active button:before {
    opacity: 1;
    content: "";
    display: block;
    width: 30px;
    height: 12px;
    border-radius: 10px;
    background-color: ${(props) => props.theme.color500};
    position: absolute;
    left: -10px;
  }
`

const Box = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;
  height: 100vh;
  margin-left: auto;
  margin-right: auto;
  font-family: "Pretendard";
  font-weight: 300;
  position: relative;
`

const SkipBtn = styled.button`
  display: flex;
  justify-content: end;
  margin-top: 70px;
  color: ${(props) => props.theme.colorCommon};
  font-size: 20px;
`

const Title = styled.div`
  display: block;
  color: ${(props) => props.theme.colorCommon};
  text-align: center;
  font-size: 21px;
  font-weight: 600;
  margin-bottom: 10px;
`

const StartBtn = styled.button`
  background-color: ${(props) => props.theme.color50};
  color: ${(props) => props.theme.color900};
  width: 270px;
  height: 66px;
  border-radius: 30px;
  position: absolute;
  bottom: 65px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 24px;
  font-weight: 500;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.5);
`

export default function Tutorial() {
  const [currentSlide, setCurrentSlide] = useState(1)

  const settings = {
    dots: true,
    infinite: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    beforeChange: (oldIndex: number, newIndex: number) => {
      setCurrentSlide(newIndex)
    },
    afterChange: (current: number) => {
      setCurrentSlide(current)
    },
  }

  const navigate = useNavigate()

  const showButtonForThirdSlide = currentSlide === 2

  return (
    <Box>
      <SkipBtn
        onClick={() => {
          navigate("/main")
        }}
      >
        SKIP
      </SkipBtn>
      <Container className="mt-9">
        <Slider {...settings}>
          <div>
            <img
              src="assets/universe/Planet-pretty.png"
              alt=""
              style={{
                width: "288.66px",
                margin: "auto",
                filter: "drop-shadow(2px 2px 2px #fbf8fca6)",
              }}
            />
            <Title>타임캡슐에 추억을 담아보세요</Title>
          </div>
          <div>
            <img
              src="assets/universe/Shake.png"
              alt=""
              style={{
                width: "310px",
                marginTop: "70px",
                filter: "drop-shadow(2px 2px 2px #fbf8fca6)",
                marginBottom: "37px",
              }}
            />
            <Title>묻혀있던 타임캡슐을 흔들어 여세요</Title>
          </div>
          <div>
            <img
              src="assets/universe/Solar System.png"
              alt=""
              style={{
                width: "300px",
                marginTop: "50px",
                filter: "drop-shadow(2px 2px 2px #fbf8fca6)",
                marginBottom: "14px",
              }}
            />
            <Title>친구들과 함께 할 수도 있어요</Title>
          </div>
        </Slider>
      </Container>
      <div style={{ textAlign: "center" }}>
        {showButtonForThirdSlide && (
          <StartBtn
            onClick={() => {
              navigate("/main")
            }}
          >
            시작하기
          </StartBtn>
        )}
      </div>
    </Box>
  )
}
