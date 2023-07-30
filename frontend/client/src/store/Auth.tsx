import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface TokenState {
  accessToken: string | null
  accountType: string
  userInfo: UserInfo
}

const initialState: TokenState = {
  accessToken: null,
  accountType: "",
  userInfo: {
    nickname: "",
    profileImage: ""
  }
}

export interface UserInfo {
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
    SET_USER: (state, action: PayloadAction<string>) => {
      state.accountType = action.payload
    },
    DELETE_TOKEN: (state) => {
      state.accessToken = null
      state.accountType = ""
    },
    DELETE_USER: (state) => {
      state.accountType = ""
      state.userInfo = {
        nickname: "",
        profileImage: ""
      }
    }
  },
})

export const { SET_TOKEN, DELETE_TOKEN, SET_USER, DELETE_USER } = authSlice.actions

export default authSlice.reducer
