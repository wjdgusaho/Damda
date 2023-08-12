import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import styled from "styled-components"
import { RootState } from "../store/Store"
import axios from "axios"
import { serverUrl } from "../urls"
import { useParams } from "react-router-dom"

interface DataType {
  timecapsuleNo: number
  capsuleType: string
  registDate: string
  openDate: string
  title: string
  description: string
  goalCard: number
  criteriaInfo: {
    criteriaId: number
    criteriaType: string
    weatherStatus: string
    startTime: string
    endTime: string
    localBig: string
    localMedium: string
    timeKr: string
    cirteriaDays: {
      dayKr: string
      dayEn: string
    }[]
  }
  partInfo: {
    userNo: number
    nickname: string
    profileImage: string
  }[]
  penalty: {
    penaltyNo: number
    penalty: boolean
    penaltyDescription: string
  }
}

const criteriaInfo = {
  criteriaId: 126,
  type: "OPEN",
  weatherStatus: "SNOW",
  startTime: 0,
  endTime: 6,
  localBig: "서울특별시",
  localMedium: "서대문구",
  timeKr: "새벽",
  cirteriaDays: null,
}

const TimecapsuleResultMembers = function () {
  const token = useSelector((state: RootState) => state.auth.accessToken)
  const [capsuleInfo, setCapsuleInfo] = useState<DataType | null>(null)
  const { capsuleId } = useParams()

  useEffect(() => {
    console.log("token", token)
    const fetchData = async () => {
      try {
        const timecapsuleNo = capsuleId
        const response = await axios.get(
          serverUrl + `timecapsule/open/detail?timecapsuleNo=${timecapsuleNo}`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        )
        console.log(
          "멤버!~!~!~~!!~!~!~~!!~~!!!!!",
          response.data.data.timecapsuleOpenDetail
        )
        setCapsuleInfo(response.data.data.timecapsuleOpenDetail)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="mt-4">
      <div className="text-sm text-center w-10/12 m-auto">
        {capsuleInfo?.description}
      </div>
      <div className="mt-2 text-sm text-center w-10/12 m-auto">
        {capsuleInfo?.criteriaInfo.weatherStatus ||
        capsuleInfo?.criteriaInfo.localBig ? (
          <>
            {criteriaInfo.weatherStatus ? (
              <div>
                <span className="font-bold">
                  {capsuleInfo?.criteriaInfo.weatherStatus === "RAIN"
                    ? "비"
                    : capsuleInfo?.criteriaInfo.weatherStatus === "SNOW"
                    ? "눈"
                    : null}
                </span>{" "}
                오는 날
              </div>
            ) : null}
            {capsuleInfo?.criteriaInfo.localBig ? (
              <>
                <span className="font-bold">
                  {capsuleInfo?.criteriaInfo.localBig}{" "}
                  {capsuleInfo?.criteriaInfo.localMedium}{" "}
                  <span className="font-normal">에서</span>
                </span>{" "}
              </>
            ) : null}
            열 수 있어요
          </>
        ) : null}
      </div>
      <div className="flex justify-center flex-wrap w-80 mt-4 ">
        {capsuleInfo?.partInfo.map((part, idx) => (
          <div key={part.userNo} className="flex flex-col">
            {idx === 0 ? (
              <>
                <div className="relative">
                  <img
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: "50%",
                      width: "44px",
                      height: "44px",
                      boxShadow: "0px 4px 4px rgb(0, 0, 0, 0.25)",
                      margin: "8px",
                    }}
                    src={part.profileImage}
                    alt="profilepic"
                  />
                  <img
                    src="../../assets/icons/crown.png"
                    alt="crown"
                    width="27px"
                    height="22px"
                    style={{
                      position: "absolute",
                      top: "-7px",
                      left: "16px",
                    }}
                  />
                </div>
                <span style={{ fontSize: "12px", textAlign: "center" }}>
                  {part.nickname}
                </span>
              </>
            ) : (
              <>
                <div className="relative">
                  <img
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: "50%",
                      width: "44px",
                      height: "44px",
                      boxShadow: "0px 4px 4px rgb(0, 0, 0, 0.25)",
                      margin: "8px",
                    }}
                    src={part.profileImage}
                    alt="profilepic"
                  />
                </div>
                <span
                  style={{
                    fontSize: "12px",
                    textAlign: "center",
                    width: "63px",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  {part.nickname}
                </span>
              </>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-center my-8">
        <FileIcon src="../../assets/icons/file.png" alt="fileicon" />
        <span>첨부파일 내려받기</span>
      </div>
    </div>
  )
}
const FileIcon = styled.img`
  width: 18px;
  height: 18px;
  margin-top: 2px;
  margin-right: 5px;
`
export default TimecapsuleResultMembers
