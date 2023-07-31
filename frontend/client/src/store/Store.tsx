import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./Auth"

const Store = configureStore({
  reducer: {
    auth: authReducer,
  },
})

export type RootState = ReturnType<typeof Store.getState>
export default Store
