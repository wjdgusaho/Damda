import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './features/CounterSlice'

export default configureStore({
  reducer: {
    counter : counterReducer,
  },
})