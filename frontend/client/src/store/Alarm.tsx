import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { FriendType } from "../components/Friend"
import { CapsuleType } from "../components/MainPage"

interface alarmData {
  friends: FriendType[]
  timecapsule: CapsuleType[]
}

const initialState: alarmData = {
  friends: [],
  timecapsule: [],
}

export const alarmSlice = createSlice({
  name: "alarm",
  initialState,
  reducers: {
    SET_FRIENDS: (state, action: PayloadAction<[FriendType]>) => {
      state.friends = action.payload
    },
    SET_TIMECAPSULES: (state, action: PayloadAction<[CapsuleType]>) => {
      state.timecapsule = action.payload
    },
    DELETE_ALARM_ALL: (state) => {
      state = initialState
    },
  },
})

export const { SET_FRIENDS, DELETE_ALARM_ALL } = alarmSlice.actions

export default alarmSlice.reducer
