import { configureStore } from "@reduxjs/toolkit"
import tokenReducer from "./Auth"

export type RootState = ReturnType<typeof Store.getState>

export const Store = configureStore({
  reducer: {
    authToken: tokenReducer,
  },
})
