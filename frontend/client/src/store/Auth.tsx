import { createSlice, PayloadAction } from "@reduxjs/toolkit"

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

export default tokenSlice.reducer
