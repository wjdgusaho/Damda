import { createSlice } from "@reduxjs/toolkit"
import {
  universeDarkTheme,
  universeLightTheme,
  heartTheme,
  marbleTheme,
} from "../theme"

let theme = createSlice({
  name: "theme",
  initialState: universeDarkTheme,
  reducers: {
    changeUniverseDarkTheme() {
      return universeDarkTheme
    },
    changeUniverseLightTheme() {
      return universeLightTheme
    },
    changeHeartTheme() {
      return heartTheme
    },
    changeMarbleTheme() {
      return marbleTheme
    },
  },
})

export let {
  changeUniverseDarkTheme,
  changeUniverseLightTheme,
  changeHeartTheme,
  changeMarbleTheme,
} = theme.actions

export default theme
