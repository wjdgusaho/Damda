import React, { useEffect, useState } from "react"
import "../index.css"
import { styled } from "styled-components"
import { SubHeader } from "./inc/SubHeader"
import { SET_THEME } from "../store/Theme"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../store/Store"
import "./datePicker.css"
import axios from "axios"
import { serverUrl } from "../urls"

const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  font-family: "Pretendard";
  justify-content: center;
  img {
    filter: drop-shadow(0px 4px 4px rgb(0, 0, 0, 0.4));
  }
`
interface themeType {
  themeNo: number
  name: string
  description: string
  price: number
  icon: string
  userHave: boolean
  type: string
}

const ThemeColor = ["#fbf8fc", "#f3f5fb", "#F6F6F6", "#F4F6F9"]
const ImgSrc = [
  "../../UniverseDark.png",
  "../../UniverseLight.png",
  "../../Heart.png",
  "../../Marble.png",
]

const SelectTheme = function () {
  let dispatch = useDispatch()
  let Theme = useSelector((state: RootState) => state.theme.color50)
  const [themeList, setThemeList] = useState<themeType[]>([])
  const token = useSelector((state: RootState) => state.auth.accessToken)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(serverUrl + "shop/list", {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        setThemeList(response.data.data.themeList)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [])

  const handleChangeTheme = (themeNo: number) => {
    axios({
      method: "PATCH",
      url: serverUrl + "theme/set-my-theme",
      headers: {
        Authorization: "Bearer " + token,
      },
      data: {
        nowTheme: themeNo,
      },
    })
      .then((response) => {
        alert(response.data.message)
        if (response.data.code === 200) {
          dispatch(SET_THEME(themeNo))
        }
      })
      .catch((error) => console.error(error))
  }

  return (
    <>
      <SubHeader />
      <Box className="w-80 m-auto mt-10">
        {themeList.map((t, index) => (
          <div key={index}>
            <img
              onClick={() => {
                if (themeList[index].userHave) {
                  handleChangeTheme(themeList[index].themeNo)
                }
              }}
              className={
                Theme === ThemeColor[index] ? "my-5 selectedTheme" : "my-5"
              }
              src={ImgSrc[index]}
              style={
                themeList[index].userHave ? {} : { filter: "grayscale(100%)" }
              }
              alt="themeImg"
            />
          </div>
        ))}
      </Box>
    </>
  )
}

export default SelectTheme
