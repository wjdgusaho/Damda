import React from "react"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { styled } from "styled-components"
import "../index.css"
import tw from "tailwind-styled-components"

const Container = styled.div`
  position: relative;
  .slick-dots {
    button::before {
      opacity: 1;
      margin-top: 80px;
    }
  }
  .slick-dots li button:before {
    content: "";
    display: block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: #fbf8fc;
  }
  .slick-dots li.slick-active button:before {
    opacity: 1;
    content: "";
    display: block;
    width: 30px;
    height: 12px;
    border-radius: 10px;
    background-color: #bb7ece;
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
  button {
    color: white;
    display: flex;
    justify-content: end;
    margin-top: 70px;
  }
`

const Text = styled.div`
  display: block;
  position: absolute;
  bottom: -10px;
`

export default function Tutorial() {
  const settings = {
    dots: true,
    infinite: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  }

  return (
    <Box>
      <button>SKIP</button>
      <Container className="mt-9">
        <Slider {...settings}>
          <div>
            <img
              src="assets/Planet-pretty.png"
              alt=""
              style={{ width: "288.66px", margin: "auto" }}
            />
            <Text>타임캡슐에 추억을 담아보세요</Text>
          </div>
          <div>
            <img
              src="assets/Shake.png"
              alt=""
              style={{ width: "310px", marginTop: "70px" }}
            />
          </div>
          <div>
            <img
              src="assets/Solar System.png"
              alt=""
              style={{ width: "300px", marginTop: "50px" }}
            />
          </div>
        </Slider>
      </Container>
    </Box>
  )
}
