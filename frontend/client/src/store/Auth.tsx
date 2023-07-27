import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"
import { serverUrl } from "../urls"
import { getCookieToken } from "./Cookie"
import { AppThunk } from "./Store" // 스토어에서 Thunk 액션을 다루기 위한 커스텀 타입을 가정합니다.

interface TokenState {
  accessToken: string | null
  accountType: string
}

const initialState: TokenState = {
  accessToken: null,
  accountType: "",
}

export const tokenSlice = createSlice({
  name: "authToken",
  initialState,
  reducers: {
    SET_TOKEN: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload
    },
    SET_ACCOUNT_TYPE: (state, action: PayloadAction<string>) => {
      state.accountType = action.payload
    },
    DELETE_TOKEN: (state) => {
      state.accessToken = null
      state.accountType = ""
    },
  },
})

export const { SET_TOKEN, DELETE_TOKEN, SET_ACCOUNT_TYPE } = tokenSlice.actions

// 비동기 작업을 위한 Redux Thunk 액션
export const refresh_accessToken = (): AppThunk => (dispatch) => {
  console.log("test")

  axios({
    method: "POST",
    url: serverUrl + "user/refresh-token",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + getCookieToken(),
    },
  })
    .then((response) => {
      console.log(response)
      dispatch(SET_TOKEN(response.data))
    })
    .catch((error) => console.error(error))
}

export default tokenSlice.reducer
