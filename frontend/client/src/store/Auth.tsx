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
    nowCapsuleCount: 0,
    savedCapsuleCount: 0,
  },
}

export interface UserInfo {
  accountType: string
  coin: number
  userNo: number
  nickname: string
  profileImage: string
  nowCapsuleCount: number
  savedCapsuleCount: number
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
      state.accessToken = ""
    },
    DELETE_USER: (state) => {
      state.userInfo = initialState.userInfo
    },
  },
})

export const { SET_TOKEN, DELETE_TOKEN, SET_USER, DELETE_USER } =
  authSlice.actions

export default authSlice.reducer
