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

interface FriendType {
  userNo: number
  nickname: string
  profileImage: string
  date: string
}

interface CapsuleType {
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
  friends: FriendType[]
  timecapsules: CapsuleType[]
}

const initialState: alarmData = {
  friends: [],
  timecapsules: [],
}

export const alarmSlice = createSlice({
  name: "alarm",
  initialState,
  reducers: {
    ADD_FRIENDS: (state, action: PayloadAction<FriendType>) => {
      state.friends.concat(action.payload)
    },
    ADD_TIMECAPSULES: (state, action: PayloadAction<CapsuleType>) => {
      state.timecapsules.concat(action.payload)
    },
    DELETE_ALARM_ALL: (state) => {
      state = initialState
    },
  },
})

export const { ADD_FRIENDS, ADD_TIMECAPSULES, DELETE_ALARM_ALL } =
  alarmSlice.actions

export default alarmSlice.reducer
