import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface authState {
  accessToken: string
  userInfo: UserInfo
}

const initialState: authState = {
  accessToken: "",
  userInfo: {
    accountType: "",
    coin: 0,
    userNo: 0,
    nickname: "",
    profileImage: "",
    nowTheme: 0,
    expiredMs: 0,
  },
}

export interface UserInfo {
  accountType: string
  coin: number
  userNo: number
  nickname: string
  profileImage: string
  nowTheme: number
  expiredMs: number
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    SET_TOKEN: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload
    },
    SET_USER: (state, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload
    },
    SET_COIN: (state, action: PayloadAction<number>) => {
      state.userInfo.coin = action.payload
    },
    DELETE_TOKEN: (state) => {
      state.accessToken = ""
    },
    DELETE_USER: (state) => {
      state.userInfo = initialState.userInfo
    },
  },
})

export const { SET_TOKEN, DELETE_TOKEN, SET_USER, DELETE_USER, SET_COIN } =
  authSlice.actions

export default authSlice.reducer
