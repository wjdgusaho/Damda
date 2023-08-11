import React, { useEffect, useMemo, useState } from "react"
import "../index.css"
import tw from "tailwind-styled-components"
import { styled } from "styled-components"
import { useNavigate, useParams } from "react-router"
import { SubHeader } from "./inc/SubHeader"
import axios from "axios"
import { serverUrl } from "../urls"
import { useSelector } from "react-redux"
import { RootState } from "../store/Store"

interface DataType {
  allCardCnt: number
  userRank: {
    userNo: number
    nickname: string
    profileImage: string
    cardCnt: number
  }[]
}

const RankBox = styled.div`
  display: flex;
  justify-content: center;
  border-bottom: 1px solid ${(props) => props.theme.color200};
  padding-bottom: 10px;
  width: 252px;
`

const RankText = styled.div`
  font-size: 12px;
`

const TimecapsuleResultRank = function () {
  const { capsuleId } = useParams()
  const token = useSelector((state: RootState) => state.auth.accessToken)
  const [rankData, setRankData] = useState<DataType>({
    allCardCnt: 0,
    userRank: [{ userNo: 0, nickname: "", profileImage: "", cardCnt: 0 }],
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios({
          method: "GET",
          url: serverUrl + `timecapsule/open/rank?timecapsuleNo=${capsuleId}`,
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        })
        setRankData(response.data.data)
      } catch (error) {
        console.log("Error fetching data:", error)
      }
    }

    fetchData()
  }, [capsuleId, token])

  console.log(rankData)
  console.log(rankData.userRank.length)

  return (
    <RankBox>
      {rankData.userRank.map((user, idx) => (
        <div key={idx}>
          {idx === 0 ? (
            <div className="flex flex-col items-center relative mt-5 mx-2">
              <img
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "50%",
                  width: "52px",
                  height: "52px",
                  boxShadow: "0px 4px 4px rgb(0, 0, 0, 0.25)",
                  margin: "8px",
                  objectFit: "cover",
                }}
                src={user.profileImage}
                alt="profilepic"
              />
              <img
                src="../../assets/icons/crown.png"
                alt="crown"
                width="27px"
                height="22px"
                style={{
                  position: "absolute",
                  top: "-9px",
                  left: "20.5px",
                }}
              />
              <RankText>{user.nickname}</RankText>
            </div>
          ) : idx === rankData.userRank.length - 1 ? (
            <div className="flex flex-col items-center relative mt-5 mx-2">
              <img
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "50%",
                  width: "52px",
                  height: "52px",
                  boxShadow: "0px 4px 4px rgb(0, 0, 0, 0.25)",
                  margin: "8px",
                  objectFit: "cover",
                }}
                src={user.profileImage}
                alt="profilepic"
              />
              <img
                src="../../assets/icons/loser.png"
                alt="crown"
                width="20px"
                height="14px"
                style={{
                  position: "absolute",
                  top: "2px",
                  right: "5px",
                }}
              />
              <RankText>{user.nickname}</RankText>
            </div>
          ) : null}
          <div className="flex flex-col">
            <img
              style={{
                backgroundColor: "#fff",
                borderRadius: "50%",
                width: "52px",
                height: "52px",
                boxShadow: "0px 4px 4px rgb(0, 0, 0, 0.25)",
                margin: "8px",
                objectFit: "cover",
              }}
              src={user.profileImage}
              alt="profilepic"
            />
          </div>
        </div>
      ))}
    </RankBox>
  )
}

export default TimecapsuleResultRank
