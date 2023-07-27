import { createSlice } from "@reduxjs/toolkit"
import axios from "axios"
import { serverUrl } from "../urls"
import { getCookieToken } from "./Cookie"

export const tokenSlice = createSlice({
  name: "authToken",
  initialState: {
    accessToken: null,
<<<<<<< Updated upstream
    expireTime: 0,
=======
>>>>>>> Stashed changes
    accountType: "",
  },
  reducers: {
    SET_TOKEN: (state, action) => {
      console.log(action)

      state.accessToken = action.payload
    },
    DELETE_TOKEN: (state) => {
      state.accessToken = null
    },
    refresh_accessToken: (state) => {
      axios({
        method: "POST",
        url: serverUrl + "user/refresh-token",
        headers: {
          "Content-Length": "application/json",
          Authorization: "Bearer " + getCookieToken(),
        },
      })
        .then((response) => {
          state.accessToken = response.data.accessToken
        })
        .catch((error) => console.error(error))
    },
  },
})

export const { SET_TOKEN, DELETE_TOKEN, refresh_accessToken } =
  tokenSlice.actions

export default tokenSlice.reducer
