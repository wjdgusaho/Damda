import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../features/CounterSlice'
import tokenReducer from './Auth'

export default configureStore({
  reducer: {
    counter : counterReducer,
    authToken: tokenReducer,
  },
})