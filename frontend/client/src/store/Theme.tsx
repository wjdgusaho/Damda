import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import {
  universeDarkTheme,
  universeLightTheme,
  heartTheme,
  marbleTheme,
} from "../theme"

const themeList = [
  universeDarkTheme, // dummy data (don't use)
  universeDarkTheme,
  universeLightTheme,
  heartTheme,
  marbleTheme,
]

let theme = createSlice({
  name: "theme",
  initialState: themeList[0],
  reducers: {
    SET_THEME: (state, action: PayloadAction<number>) => {
      return themeList[action.payload]
    },
  },
})

export let { SET_THEME } = theme.actions

export default theme
