import React, { useEffect, useState } from "react"
import "../index.css"
import { styled } from "styled-components"
import { useParams } from "react-router"
import axios from "axios"
import { useSelector } from "react-redux"
import { RootState } from "../store/Store"
import { motion } from "framer-motion"

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
  text-align: center;
  width: 67px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

const GraphText = styled(RankText)`
  width: 51px;
`

const GraphBox = styled.div`
  width: 252px;
  height: 280px;
  overflow: scroll;
`

const GraphBar = styled.div`
  position: relative;
  height: 18px;
  background-color: ${(props) => props.theme.color100};
  border-radius: 10px;
  margin-top: 17px;
  margin-left: -18px;
  box-shadow: 0px 4px 4px rgb(0, 0, 0, 0.25);
  span {
    position: absolute;
    right: -33px;
    font-size: 12px;
    color: ${(props) => props.theme.color500};
  }
`

const TimecapsuleResultRank = function () {
  const { capsuleId } = useParams()
  const token = useSelector((state: RootState) => state.auth.accessToken)
  const [rankData, setRankData] = useState<DataType>({
    allCardCnt: 0,
    userRank: [{ userNo: 0, nickname: "", profileImage: "", cardCnt: 0 }],
  })
  const bestUserCnt = rankData.userRank[0].cardCnt
  const [isClick, setIsClick] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios({
          method: "GET",
          url:
            process.env.REACT_APP_SERVER_URL +
            `timecapsule/open/rank?timecapsuleNo=${capsuleId}`,
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

  // console.log(rankData)
  // console.log(rankData.userRank.length)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
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
                <GraphText>{user.nickname}</GraphText>
              </div>
            ) : null}
          </div>
        ))}
      </RankBox>
      <GraphBox>
        {rankData.userRank.map((user, idx) => (
          <div
            key={idx}
            className="flex"
            onClick={() => {
              setIsClick(!isClick)
            }}
          >
            <div className="z-10">
              <img
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "50%",
                  width: "35px",
                  height: "35px",
                  boxShadow: "0px 4px 4px rgb(0, 0, 0, 0.25)",
                  margin: "8px",
                  objectFit: "cover",
                }}
                src={user.profileImage}
                alt="profilepic"
              />
              <GraphText>{user.nickname}</GraphText>
            </div>
            <GraphBar
              style={{
                width: `calc(184px * ${user.cardCnt / bestUserCnt})`,
              }}
            >
              {isClick ? (
                <span style={{ letterSpacing: "-0.8px" }}>
                  {user.cardCnt} 개
                </span>
              ) : (
                <span>
                  {Math.round((user.cardCnt / rankData.allCardCnt) * 100)}%
                </span>
              )}
            </GraphBar>
          </div>
        ))}
      </GraphBox>
    </motion.div>
  )
}

export default TimecapsuleResultRank
