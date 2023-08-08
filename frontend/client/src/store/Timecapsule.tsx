import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { CapsuleType } from "../components/MainPage"

interface timecapsuleState {
  timecapsules: CapsuleType[]
  nowCapsuleCount: number
  savedCapsuleCount: number
}

const initialState: timecapsuleState = {
  timecapsules: [],
  nowCapsuleCount: 0,
  savedCapsuleCount: 0,
}

export const timecapsuleSlice = createSlice({
  name: "timecapsule",
  initialState,
  reducers: {
    SET_TIMECAPSULE: (
      state: timecapsuleState,
      action: PayloadAction<CapsuleType[]>
    ) => {
      state.timecapsules = action.payload
      state.nowCapsuleCount = action.payload.length
    },
    DELETE_TIMECAPSULE: (state) => {
      state.timecapsules = []
      state.nowCapsuleCount = 0
    },
  },
})

export const { SET_TIMECAPSULE, DELETE_TIMECAPSULE } = timecapsuleSlice.actions

export default timecapsuleSlice.reducer
