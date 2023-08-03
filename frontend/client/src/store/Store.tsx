import {
  configureStore,
  getDefaultMiddleware,
  combineReducers,
} from "@reduxjs/toolkit"
import sessionStorage from "redux-persist/lib/storage/session"
import { persistReducer } from "redux-persist"
import thunk from "redux-thunk"
import authReducer from "./Auth"
import theme from "./Theme"
import Timecapsule from "./Timecapsule"

const persistConfig = {
  key: "root",
  storage: sessionStorage,
}

const reducers = combineReducers({
  auth: authReducer,
  theme: theme.reducer,
  timecapsule: Timecapsule,
})

const persistedReducer = persistReducer(persistConfig, reducers)

const Store = configureStore({
  reducer: persistedReducer,
  middleware: [...getDefaultMiddleware({ serializableCheck: false }), thunk],
})

export type RootState = ReturnType<typeof Store.getState>
export default Store
