import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ToastOptions } from "react-toastify"

export const toastOption: ToastOptions = {
  position: "top-right",
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: true,
  rtl: false,
  pauseOnHover: true,
  draggable: true,
  pauseOnFocusLoss: true,
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
  timecapsuleNo: number
  fromUser: number
  fromName: string
  fromProfileImage: string
  content: string
  code: string
  date: string
}

export interface alarmOpenCapsuleType {
  timecapsuleNo: number
  content: string
  type: string
  title: string
  date: string
}

interface alarmData {
  friends: alarmFriendType[]
  timecapsules: alarmCapsuleType[]
  openCapsules: alarmOpenCapsuleType[]
  eventSource: EventSource | null
}

const initialState: alarmData = {
  friends: [],
  timecapsules: [],
  openCapsules: [],
  eventSource: null,
}

export const alarmSlice = createSlice({
  name: "alarm",
  initialState,
  reducers: {
    ADD_FRIENDS: (state, action: PayloadAction<alarmFriendType>) => {
      if (state.friends.every((f) => f.fromUser !== action.payload.fromUser)) {
        state.friends = state.friends.concat(action.payload)
      }
    },
    ADD_TIMECAPSULES: (state, action: PayloadAction<alarmCapsuleType>) => {
      if (state.timecapsules.every((t) => t.code !== action.payload.code)) {
        state.timecapsules = state.timecapsules.concat(action.payload)
      }
    },
    ADD_OPENTIMECAPSULES: (
      state,
      action: PayloadAction<alarmOpenCapsuleType>
    ) => {
      if (
        state.openCapsules.every(
          (o) => o.timecapsuleNo !== action.payload.timecapsuleNo
        )
      ) {
        state.openCapsules = state.openCapsules.concat(action.payload)
      }
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
    DELETE_OPENTIMECAPSULES: (state, action: PayloadAction<number>) => {
      state.openCapsules = state.openCapsules.filter(
        (t) => t.timecapsuleNo !== action.payload
      )
    },
    DELETE_SSE: (state) => {
      state.eventSource = null
    },
    DELETE_ALARM_ALL: (state) => {
      state.friends = []
      state.openCapsules = []
      state.timecapsules = []
    },
  },
})

export const {
  ADD_FRIENDS,
  ADD_TIMECAPSULES,
  ADD_OPENTIMECAPSULES,
  SET_SSE,
  DELETE_FRIENDS,
  DELETE_TIMECAPSULES,
  DELETE_OPENTIMECAPSULES,
  DELETE_SSE,
  DELETE_ALARM_ALL,
} = alarmSlice.actions

export default alarmSlice.reducer
