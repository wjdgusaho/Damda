import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit"
import authReducer from "./Auth"
import thunk from "redux-thunk"
import theme from "./Theme"

const Store = configureStore({
  reducer: {
    auth: authReducer,
    theme: theme.reducer,
  },
  middleware: [...getDefaultMiddleware(), thunk],
})

export type RootState = ReturnType<typeof Store.getState>
export default Store
