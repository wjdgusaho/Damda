import { Action, configureStore } from "@reduxjs/toolkit"
import tokenReducer from "./Auth"
import { ThunkAction } from "@reduxjs/toolkit"

export type RootState = ReturnType<typeof Store.getState>

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<any> // 필요에 따라 해당 액션의 타입을 지정해주어야 합니다.
>

export const Store = configureStore({
  reducer: {
    authToken: tokenReducer,
  },
})
