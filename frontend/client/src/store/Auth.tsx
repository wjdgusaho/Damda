import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface authState {
  accessToken: string | null
  userInfo: UserInfo
}

const initialState: authState = {
  accessToken: null,
  userInfo: {
    accountType: "",
    coin: 0,
    userNo: 0,
    nickname: "",
    profileImage: "",
  },
}

export interface UserInfo {
  accountType: string
  coin: number
  userNo: number
  nickname: string
  profileImage: string
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
    DELETE_TOKEN: (state) => {
      state.accessToken = null
    },
    DELETE_USER: (state) => {
      state.userInfo = {
        accountType: "",
        coin: 0,
        userNo: 0,
        nickname: "",
        profileImage: "",
      }
    },
  },
})

export const { SET_TOKEN, DELETE_TOKEN, SET_USER, DELETE_USER } =
  authSlice.actions

export default authSlice.reducer
