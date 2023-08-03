import React, { useEffect, useState } from "react"
import "../index.css"
import tw from "tailwind-styled-components"
import { styled } from "styled-components"
import { useNavigate, useParams } from "react-router"
import { SubHeader } from "./inc/SubHeader"
import axios from "axios"
import { serverUrl } from "../urls"
import { useSelector } from "react-redux"
import { RootState } from "../store/Store"

interface DataeType {
  timecapsule: {
    timecapsuleNo: number
    capsuleType: string
    registDate: string
    openDate: string
    title: string
    description: string
    capsuleIcon: string
    goalCard: number
    nowCard: number
    penalty: {
      penaltyNo: number
      penalty: boolean
      penaltyDescription: string
    }
  }
  criteriaInfo: {
    criteriaId: number
    criteriaType: string
    weatherStatus: string
    startTime: string
    endTime: string
    localMedium: string
    timeKr: string
  }
  myInfo: {
    userNo: number
    cardAble: boolean
    fileAble: boolean
    host: boolean
  }
  partInfo: [
    {
      userNo: number
      nickname: string
      profileImage: string
    }
  ]
}

const TimeCapsuleDetail = function () {
  const { capsuleId } = useParams()
  const token = useSelector((state: RootState) => state.auth.accessToken)

  useEffect(() => {
    axios({
      method: "GET",
      url: serverUrl + `timecapsule/detail?timecapsuleNo=${capsuleId}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  return (
    <>
      <SubHeader />
    </>
  )
}

export default TimeCapsuleDetail
