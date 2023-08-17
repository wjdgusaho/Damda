import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import styled from "styled-components"
import { RootState } from "../store/Store"
import axios from "axios"
import { useParams } from "react-router-dom"
import toast, { Toaster } from "react-hot-toast"
import { motion } from "framer-motion"

interface DataType {
  timecapsuleNo: number
  capsuleType: string
  registDate: string
  openDate: string
  title: string
  description: string
  goalCard: number
  nowFileSize: number
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

const TimecapsuleResultMembers = function () {
  const token = useSelector((state: RootState) => state.auth.accessToken)
  const [capsuleInfo, setCapsuleInfo] = useState<DataType | null>(null)
  const { capsuleId } = useParams()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const timecapsuleNo = capsuleId
        const response = await axios.get(
          process.env.REACT_APP_SERVER_URL +
            `timecapsule/open/detail?timecapsuleNo=${timecapsuleNo}`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        )
        setCapsuleInfo(response.data.data.timecapsuleOpenDetail)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [])

  function fileDownload(): void {
    const fetchData = async () => {
      try {
        const timecapsuleNo = capsuleId
        const response = await axios.get(
          process.env.REACT_APP_SERVER_URL +
            `s3/download/zip/timecapsule/${timecapsuleNo}/file`,
          {
            responseType: "blob", // 중요: 응답 유형을 'blob'으로 설정
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        )

        // console.log("파일~!!~!~!~!!!!", response)
        if (response.status === 200) {
          const downloadUrl = window.URL.createObjectURL(
            new Blob([response.data])
          )
          const link = document.createElement("a")
          link.href = downloadUrl
          link.setAttribute("download", "file.zip") // 파일 이름 지정. 원하는 이름으로 변경 가능
          document.body.appendChild(link)
          link.click()
          link.remove()
        } else {
          toast("파일 다운로드 중 문제가 생겼어요!")
        }
      } catch (error) {
        console.error(error)
      }
    }

    toast(`다운로드 하는데 시간이 소요됩니다! ${"\n"}조금만 기다려주세요`)
    fetchData()
  }

  return (
    <motion.div
      className="mt-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Toaster toastOptions={{ duration: 1000 }} />
      <div className="text-sm text-center w-10/12 m-auto">
        {capsuleInfo?.description}
      </div>
      <div className="mt-2 text-sm text-center w-10/12 m-auto">
        {capsuleInfo?.criteriaInfo.weatherStatus ||
        capsuleInfo?.criteriaInfo.localBig ? (
          <>
            {capsuleInfo.criteriaInfo.weatherStatus ? (
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
        {capsuleInfo?.capsuleType === "GOAL" &&
        capsuleInfo?.penalty.penaltyNo !== null ? (
          <div className="text-center mt-3">
            카드를 가장 적게 작성한 친구는 <br />{" "}
            <span className="font-bold">
              {capsuleInfo?.penalty.penaltyDescription}
            </span>{" "}
            벌칙을 받아요
          </div>
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
      {capsuleInfo?.nowFileSize !== 0 && (
        <div className="flex justify-center my-8" onClick={fileDownload}>
          <FileIcon src="../../assets/icons/file.png" alt="fileicon" />
          <span>첨부파일 내려받기</span>
        </div>
      )}
    </motion.div>
  )
}
const FileIcon = styled.img`
  width: 18px;
  height: 18px;
  margin-top: 2px;
  margin-right: 5px;
`
export default TimecapsuleResultMembers
