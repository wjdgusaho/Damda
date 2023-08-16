import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { CapsuleType } from "../components/MainPage"
import { DataType } from "../components/TimeCapsuleDetail"

interface countType {
  savedCapsuleCount: number
  nowCapsuleCount: number
}

interface timecapsuleState {
  timecapsuleList: CapsuleType[]
  timecapsuleDetail: DataType
  userTimecapsuleInfo: countType
}

const initialState: timecapsuleState = {
  timecapsuleList: [],
  timecapsuleDetail: {
    timecapsuleNo: 0,
    capsuleType: "",
    registDate: "",
    openDate: "",
    title: "",
    description: "",
    capsuleIcon: "",
    goalCard: 0,
    nowCard: 0,
    inviteCode: "",
    maxParticipant: 0,
    nowParticipant: 0,
    penalty: {
      penaltyNo: 0,
      penalty: false,
      penaltyDescription: "",
    },

    criteriaInfo: {
      criteriaId: 0,
      criteriaType: "",
      weatherStatus: "",
      startTime: "",
      endTime: "",
      localBig: "",
      localMedium: "",
      timeKr: "",
      cirteriaDays: [
        {
          dayKr: "",
          dayEn: "",
        },
      ],
    },
    myInfo: {
      userNo: 0,
      cardAble: false,
      fileAble: false,
      host: false,
    },
    partInfo: [
      {
        userNo: 0,
        nickname: "",
        profileImage: "",
      },
    ],
  },
  userTimecapsuleInfo: {
    nowCapsuleCount: 0,
    savedCapsuleCount: 0,
  },
}

export const timecapsuleSlice = createSlice({
  name: "timecapsule",
  initialState,
  reducers: {
    SET_TIMECAPSULE: (
      state: timecapsuleState,
      action: PayloadAction<timecapsuleState>
    ) => {
      state.timecapsuleList = action.payload.timecapsuleList
      state.userTimecapsuleInfo = action.payload.userTimecapsuleInfo
    },
    SET_DETAIL: (state: timecapsuleState, action: PayloadAction<DataType>) => {
      state.timecapsuleDetail = action.payload
    },
    DELETE_DETAIL: (state) => {
      state.timecapsuleDetail = initialState.timecapsuleDetail
    },
    DELETE_TIMECAPSULE: (state) => {
      state.timecapsuleList = []
      state.userTimecapsuleInfo = {
        nowCapsuleCount: 0,
        savedCapsuleCount: 0,
      }
    },
  },
})

export const {
  SET_TIMECAPSULE,
  SET_DETAIL,
  DELETE_DETAIL,
  DELETE_TIMECAPSULE,
} = timecapsuleSlice.actions

export default timecapsuleSlice.reducer
