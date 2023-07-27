import { createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import { serverUrl } from "../urls"
import { getCookieToken } from "./Cookie"

export const TOKEN_TIME_OUT = 600 * 1000

export const tokenSlice = createSlice({
  name: "authToken",
  initialState: {
    authenticated: false,
    accessToken: null,
    expireTime: 0,
    accountType: "",
  },
  reducers: {
    SET_TOKEN: (state, action) => {
      state.authenticated = true
      state.accessToken = action.payload
      state.expireTime = new Date().getTime() + TOKEN_TIME_OUT
    },
    DELETE_TOKEN: (state) => {
      state.authenticated = false
      state.accessToken = null
      state.expireTime = 0
    },
    refresh_accessToken: () => {
      axios({
        method: "POST",
        url: serverUrl + "user/refresh-token",
        headers: {
          "Content-Length": "application/json",
          Authorization: "Bearer " + getCookieToken(),
        },
      })
        .then((response) => {
          SET_TOKEN(response.data.accessToken)
        })
        .catch((error) => console.error(error))
    },
  },
})

export const { SET_TOKEN, DELETE_TOKEN, refresh_accessToken } =
  tokenSlice.actions

export default tokenSlice.reducer
