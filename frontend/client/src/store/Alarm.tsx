import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ToastOptions } from "react-toastify"

export const toastOption: ToastOptions = {
  position: "top-right",
  autoClose: false,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: true,
  progress: undefined,
  theme: "light",
}

export interface alarmFriendType {
  fromUser: number
  fromName: string
  fromProfileImage: string
  content: string
  date: string
}

export interface alarmCapsuleType {
  fromUser: number
  fromName: string
  fromProfileImage: string
  content: string
  code: string
  date: string
}

interface alarmData {
  friends: alarmFriendType[]
  timecapsules: alarmCapsuleType[]
  eventSource: EventSource | null
}

const initialState: alarmData = {
  friends: [],
  timecapsules: [],
  eventSource: null,
}

export const alarmSlice = createSlice({
  name: "alarm",
  initialState,
  reducers: {
    ADD_FRIENDS: (state, action: PayloadAction<alarmFriendType>) => {
      state.friends = state.friends.concat(action.payload)
    },
    ADD_TIMECAPSULES: (state, action: PayloadAction<alarmCapsuleType>) => {
      state.timecapsules = state.timecapsules.concat(action.payload)
    },
    SET_SSE: (state, action: PayloadAction<EventSource>) => {
      state.eventSource = action.payload
    },
    DELETE_FRIENDS: (state, action: PayloadAction<number>) => {
      state.friends = state.friends.filter((f) => f.fromUser !== action.payload)
    },
    DELETE_TIMECAPSULES: (state, action: PayloadAction<number>) => {
      state.timecapsules = state.timecapsules.filter(
        (t) => t.fromUser !== action.payload
      )
    },
    DELETE_SSE: (state) => {
      state.eventSource = null
    },
    DELETE_ALARM_ALL: (state) => {
      state = initialState
    },
  },
})

export const {
  ADD_FRIENDS,
  ADD_TIMECAPSULES,
  SET_SSE,
  DELETE_FRIENDS,
  DELETE_TIMECAPSULES,
  DELETE_SSE,
  DELETE_ALARM_ALL,
} = alarmSlice.actions

export default alarmSlice.reducer
