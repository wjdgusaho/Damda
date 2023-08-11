import React from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { RootState } from "../store/Store"

export const EmptyPage = function () {
  const token = useSelector((state: RootState) => state.auth.accessToken)
  const navigate = useNavigate()
  setTimeout(() => {
    if (token) {
      navigate("/main")
    } else {
      navigate("/")
    }
  }, 10)
  return <div></div>
}
