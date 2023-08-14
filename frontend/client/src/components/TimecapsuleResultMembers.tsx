import React from "react"
import styled from "styled-components"
const partInfo = [
  {
    userNo: 29,
    nickname: "나쵸",
    profileImage:
      "https://damda.s3.ap-northeast-2.amazonaws.com/user-profileImage/34587ea6-e3e3-47f2-8464-1dfd025f7c35.jpg",
  },
  {
    userNo: 35,
    nickname: "차영범",
    profileImage:
      "https://damda.s3.ap-northeast-2.amazonaws.com/user-profileImage/profile.jpg",
  },
  {
    userNo: 73,
    nickname: "이거시간왜이래",
    profileImage:
      "https://damda.s3.ap-northeast-2.amazonaws.com/user-profileImage/profile.jpg",
  },
  {
    userNo: 32,
    nickname: "달토끼맛쿠키",
    profileImage:
      "https://damda.s3.ap-northeast-2.amazonaws.com/user-profileImage/4c41d06b-30e9-485a-a7f5-fe66e089c975.png",
  },
  {
    userNo: 29,
    nickname: "나쵸",
    profileImage:
      "https://damda.s3.ap-northeast-2.amazonaws.com/user-profileImage/34587ea6-e3e3-47f2-8464-1dfd025f7c35.jpg",
  },
  {
    userNo: 35,
    nickname: "차영범",
    profileImage:
      "https://damda.s3.ap-northeast-2.amazonaws.com/user-profileImage/profile.jpg",
  },
  {
    userNo: 73,
    nickname: "이거시간왜이래",
    profileImage:
      "https://damda.s3.ap-northeast-2.amazonaws.com/user-profileImage/profile.jpg",
  },
  {
    userNo: 73,
    nickname: "이거시간왜이래",
    profileImage:
      "https://damda.s3.ap-northeast-2.amazonaws.com/user-profileImage/profile.jpg",
  },
  {
    userNo: 73,
    nickname: "이거시간왜이래",
    profileImage:
      "https://damda.s3.ap-northeast-2.amazonaws.com/user-profileImage/profile.jpg",
  },
  {
    userNo: 32,
    nickname: "달토끼맛쿠키",
    profileImage:
      "https://damda.s3.ap-northeast-2.amazonaws.com/user-profileImage/4c41d06b-30e9-485a-a7f5-fe66e089c975.png",
  },
]

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
  return (
    <div className="mt-4">
      <div className="text-sm text-center w-10/12 m-auto">
        타임캡슐 상세내용이 여기에 들어갈거에용!@@!@!@!@!@! 타임캡슐 상세내용이
        여기에 들어갈거에용!@@!@!@!@!@!
      </div>
      <div className="mt-2 text-sm text-center w-10/12 m-auto">
        {criteriaInfo.weatherStatus || criteriaInfo.localBig ? (
          <>
            {criteriaInfo.weatherStatus ? (
              <div>
                <span className="font-bold">
                  {criteriaInfo.weatherStatus === "RAIN"
                    ? "비"
                    : criteriaInfo.weatherStatus === "SNOW"
                    ? "눈"
                    : null}
                </span>{" "}
                오는 날
              </div>
            ) : null}
            {criteriaInfo.localBig ? (
              <>
                <span className="font-bold">
                  {criteriaInfo.localBig} {criteriaInfo.localMedium}{" "}
                  <span className="font-normal">에서</span>
                </span>{" "}
              </>
            ) : null}
            열 수 있어요
          </>
        ) : null}
      </div>
      <div className="flex justify-center flex-wrap w-80 mt-4 ">
        {partInfo.map((part, idx) => (
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
