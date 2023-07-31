import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit"
import authReducer from "./Auth"
import thunk from "redux-thunk"

const Store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: [...getDefaultMiddleware(), thunk],
})

export type RootState = ReturnType<typeof Store.getState>
export default Store
