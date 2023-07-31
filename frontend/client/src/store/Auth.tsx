import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface authState {
  accessToken: string | null
  userInfo: UserInfo
}

const initialState: authState = {
  accessToken: null,
  userInfo: {
    accountType: "",
    nickname: "",
    profileImage: "",
  },
}

export interface UserInfo {
  accountType: string
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
      console.log(action)

      // state.accountType = action.payload
    },
    DELETE_TOKEN: (state) => {
      state.accessToken = null
    },
    DELETE_USER: (state) => {
      state.userInfo = {
        accountType: "",
        nickname: "",
        profileImage: "",
      }
    },
  },
})

export const { SET_TOKEN, DELETE_TOKEN, SET_USER, DELETE_USER } =
  authSlice.actions

export default authSlice.reducer
