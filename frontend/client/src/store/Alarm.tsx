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
  timecapsuleNo: number
  type: string
  sDate: string
  eDate: string
  name: string
  capsuleIconNo: string
  curCard: number
  goalCard: number
  date: string
}

interface alarmData {
  friends: alarmFriendType[]
  timecapsules: alarmCapsuleType[]
}

const initialState: alarmData = {
  friends: [],
  timecapsules: [],
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
    DELETE_FRIENDS: (state, action: PayloadAction<number>) => {
      state.friends = state.friends.filter((f) => f.fromUser !== action.payload)
    },
    DELETE_TIMECAPSULES: (state, action: PayloadAction<number>) => {
      state.timecapsules = state.timecapsules.filter(
        (t) => t.timecapsuleNo !== action.payload
      )
    },
    DELETE_ALARM_ALL: (state) => {
      state = initialState
    },
  },
})

export const {
  ADD_FRIENDS,
  ADD_TIMECAPSULES,
  DELETE_FRIENDS,
  DELETE_TIMECAPSULES,
  DELETE_ALARM_ALL,
} = alarmSlice.actions

export default alarmSlice.reducer
