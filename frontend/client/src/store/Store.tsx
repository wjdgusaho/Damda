import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./Auth"

export type RootState = ReturnType<typeof Store.getState>

export const Store = configureStore({
  reducer: {
    auth: authReducer,
  },
})
