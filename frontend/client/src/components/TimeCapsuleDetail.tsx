import React, { useState } from "react"
import "../index.css"
import tw from "tailwind-styled-components"
import { styled } from "styled-components"
import { useNavigate, useParams } from "react-router"
import { SubHeader } from "./inc/SubHeader"
import axios from "axios"
import { serverUrl } from "../urls"
import { useSelector } from "react-redux"
import { RootState } from "../store/Store"

const TimeCapsuleDetail = function () {
  const { capsuleId } = useParams()

  return <div>타임캡슐 상세{capsuleId}</div>
}

export default TimeCapsuleDetail
