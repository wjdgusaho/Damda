import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { CapsuleType } from "../components/MainPage"

interface timecapsuleState {
  timecapsules: CapsuleType[]
}

const initialState: timecapsuleState = {
  timecapsules: [],
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
    },
    DELETE_TIMECAPSULE: (state) => {
      state.timecapsules = []
    },
  },
})

export const {} = timecapsuleSlice.actions

export default timecapsuleSlice.reducer
