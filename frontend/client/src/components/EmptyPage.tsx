import React from "react"
import { useNavigate } from "react-router-dom"

export const EmptyPage = function () {
  const navigate = useNavigate()
  setTimeout(() => {
    navigate("/")
  }, 2000)
  return <div>빈 페이지입니다.</div>
}
