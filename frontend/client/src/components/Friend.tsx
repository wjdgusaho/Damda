import React, { useState, useEffect } from "react"
import { SubHeader } from "./inc/SubHeader"
import { styled } from "styled-components"
import { Link } from "react-router-dom"
import axios from "axios"
import { serverUrl } from "../urls"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../store/Store"
import { DELETE_FRIENDS } from "../store/Alarm"

const Friend = function () {
  const themeState = useSelector((state: RootState) => state.theme.colorCommon)
  const [comp, setComp] = useState("list")
  const [activeComponent, setActiveComponent] = useState("list")

  const handleNavClick = (compName: string) => {
    setActiveComponent(compName)
  }

  return (
    <div>
      <SubHeader></SubHeader>
      <div>
        <div className="text-center mt-10">
          <TextStyle className="text-xl">내 친구</TextStyle>
        </div>
        <div className="flex">
          <Link to="/friend/search" className="w-6 ml-auto mr-14">
            <img
              className={themeState === "black" ? "invert" : ""}
              src="/assets/icons/friendAdd.png"
              alt="add"
            />
          </Link>
        </div>
      </div>
      <div className="flex justify-evenly mt-6 mb-8">
        <Nav
          onClick={() => {
            setComp("list")
            handleNavClick("list")
          }}
          isActive={activeComponent === "list"}
        >
          친구 목록
        </Nav>
        <Nav
          onClick={() => {
            setComp("request")
            handleNavClick("request")
          }}
          isActive={activeComponent === "request"}
        >
          받은 친구 요청
        </Nav>
      </div>
      {comp === "list" && <List />}
      {comp === "request" && <Request />}
    </div>
  )
}

export const List = function () {
  const [friendList, setFriendList] = useState<FriendType[]>([])
  const [favoriteFriendList, setFavoriteFriendList] = useState<FriendType[]>([])
  const token = useSelector((state: RootState) => state.auth.accessToken)
  useEffect(() => {
    axios({
      method: "GET",
      url: serverUrl + "friend/list",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => {
        const newlist = response.data.data.result
        setFriendList(
          newlist.filter((f: FriendType) => {
            return f.favorite === false
          })
        )
        setFavoriteFriendList(
          newlist.filter((f: FriendType) => {
            return f.favorite === true
          })
        )
      })
      .catch((error) => console.error(error))
  }, [])

  const changeAlign = () => {
    const newlist = [...favoriteFriendList, ...friendList]
    setFriendList(
      newlist.filter((f: FriendType) => {
        return f.favorite === false
      })
    )
    setFavoriteFriendList(
      newlist.filter((f: FriendType) => {
        return f.favorite === true
      })
    )
  }

  return (
    <div>
      {friendList.length === 0 && favoriteFriendList.length === 0 && (
        <div className="text-center mt-20">
          <TextStyle
            style={{ opacity: "50%", fontSize: "20px", fontWeight: "200" }}
          >
            친구를 찾으러 떠나볼까요?
          </TextStyle>
          <div className="relative">
            <img
              className="m-auto mt-20"
              style={{ width: "15rem" }}
              src="/assets/universe/Astronaut-4.png"
              alt="Astronaut-4"
            />
            <CapsuleShadow className="m-auto !h-12 !w-40"></CapsuleShadow>
          </div>
        </div>
      )}
      {favoriteFriendList.length !== 0 && (
        <div>
          {favoriteFriendList.map((f: FriendType) => (
            <FriendCard
              key={f.userNo}
              friend={f}
              friendList={favoriteFriendList}
              setFriendList={setFavoriteFriendList}
              changeAlign={changeAlign}
            ></FriendCard>
          ))}
        </div>
      )}
      {friendList.length !== 0 && (
        <div>
          {friendList.map((f: FriendType) => (
            <FriendCard
              key={f.userNo}
              friend={f}
              friendList={friendList}
              setFriendList={setFriendList}
              changeAlign={changeAlign}
            ></FriendCard>
          ))}
        </div>
      )}
    </div>
  )
}

export const Request = function () {
  const [requestList, setRequestList] = useState<FriendType[]>([])
  const token = useSelector((state: RootState) => state.auth.accessToken)
  useEffect(() => {
    axios({
      method: "GET",
      url: serverUrl + "friend/request",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => {
        setRequestList(response.data.data.result)
      })
      .catch((error) => console.error(error))
  }, [])
  return (
    <div>
      {requestList.length === 0 && (
        <div className="text-center mt-20">
          <TextStyle className="text-victoria-400">
            친구요청이 없어요... 아직은요!
          </TextStyle>
          <img
            className="w-72 m-auto mt-12"
            src="/assets/universe/Astronaut-4.png"
            alt="Astronaut-4"
          />
          <CapsuleShadow className="m-auto !h-12 !w-40"></CapsuleShadow>
        </div>
      )}
      {requestList.length !== 0 && (
        <div>
          {requestList.map((f: FriendType) => (
            <RequestCard
              key={f.userNo}
              friend={f}
              requestList={requestList}
              setRequestList={setRequestList}
            ></RequestCard>
          ))}
        </div>
      )}
    </div>
  )
}

const FriendCard = function ({
  friend,
  friendList,
  setFriendList,
  changeAlign,
}: {
  friend: FriendType
  friendList: FriendType[]
  setFriendList: React.Dispatch<React.SetStateAction<FriendType[]>>
  changeAlign: () => void
}) {
  const token = useSelector((state: RootState) => state.auth.accessToken)
  const themeState = useSelector((state: RootState) => state.theme.colorCommon)

  const favoriteRequest = (event: React.MouseEvent<HTMLButtonElement>) => {
    axios({
      method: "PATCH",
      url: serverUrl + "friend/favorite-add",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      data: {
        userNo: friend.userNo,
      },
    })
      .then((response) => {
        const code = response.data.code
        alert(response.data.message)
        if (code === 200) {
          let newList = friendList.map((f) => {
            if (f.userNo === friend.userNo) {
              f.favorite = true
            }
            return f
          })
          setFriendList(newList)
          changeAlign()
        }
      })
      .catch((error) => console.error(error))
  }

  const favoriteCancel = (event: React.MouseEvent<HTMLButtonElement>) => {
    axios({
      method: "PATCH",
      url: serverUrl + "friend/favorite-del",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      data: {
        userNo: friend.userNo,
      },
    })
      .then((response) => {
        const code = response.data.code
        alert(response.data.message)
        if (code === 200) {
          let newList = friendList.map((f) => {
            if (f.userNo === friend.userNo) {
              f.favorite = false
            }
            return f
          })
          setFriendList(newList)
          changeAlign()
        }
      })
      .catch((error) => console.error(error))
  }

  const friendDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    axios({
      method: "PATCH",
      url: serverUrl + "friend/delete",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      data: {
        userNo: friend.userNo,
      },
    }).then((response) => {
      const code = response.data.code
      alert(response.data.message)
      if (code === 200 || code === -9005) {
        let newList = friendList.filter((f) => {
          return f.userNo !== friend.userNo
        })
        setFriendList(newList)
        changeAlign()
      }
    })
  }

  return (
    <div className="flex w-10/12 items-center m-auto p-2">
      <img
        style={{
          backgroundColor: "#fff",
          borderRadius: "50%",
          width: "52px",
          height: "52px",
        }}
        src={friend.profileImage}
        alt="profilepic"
      />
      <TextStyle className="ml-4 text-white">
        {friend.nickname}
        <span className="ml-1" style={{ opacity: "50%", fontWeight: "300" }}>
          #{friend.userNo}
        </span>
        {/* 여기 수정 */}
      </TextStyle>
      <div className="flex ml-auto mr-3">
        {friend.favorite ? (
          <button className="w-5 mr-4" onClick={favoriteCancel}>
            <img
              className={themeState === "black" ? "invert" : ""}
              src="/assets/icons/star.png"
              alt="즐겨찾는친구"
            />
          </button>
        ) : (
          <button className="w-5 mr-4 opacity-10" onClick={favoriteRequest}>
            <img
              className={themeState === "black" ? "invert" : ""}
              src="/assets/icons/star.png"
              alt="즐겨찾기안됨"
            />
          </button>
        )}
        <button className="w-5" onClick={friendDelete}>
          <img
            className={themeState === "black" ? "invert opacity-60" : ""}
            src="/assets/icons/button_x.png"
            alt="삭제"
          />
        </button>
      </div>
    </div>
  )
}
const RequestCard = function ({
  friend,
  requestList,
  setRequestList,
}: {
  friend: FriendType
  requestList: FriendType[]
  setRequestList: React.Dispatch<React.SetStateAction<FriendType[]>>
}) {
  const token = useSelector((state: RootState) => state.auth.accessToken)
  const dispatch = useDispatch()
  const requestAccept = (event: React.MouseEvent<HTMLButtonElement>) => {
    axios({
      method: "PATCH",
      url: serverUrl + "friend/request-accept",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      data: {
        userNo: friend.userNo,
      },
    })
      .then((response) => {
        const code = response.data.code
        alert(response.data.message)
        if (code === 200) {
          const newList = requestList.filter(
            (request) => request.userNo !== friend.userNo
          )
          setRequestList(newList)
          dispatch(DELETE_FRIENDS(friend.userNo))
        }
      })
      .catch((error) => console.error(error))
  }

  const requestReject = (event: React.MouseEvent<HTMLButtonElement>) => {
    axios({
      method: "PATCH",
      url: serverUrl + "friend/request-reject",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      data: {
        userNo: friend.userNo,
      },
    })
      .then((response) => {
        const code = response.data.code
        alert(response.data.message)
        if (code === 200) {
          const newList = requestList.filter(
            (request) => request.userNo !== friend.userNo
          )
          setRequestList(newList)
          dispatch(DELETE_FRIENDS(friend.userNo))
        }
      })
      .catch((error) => console.error(error))
  }

  return (
    <div className="flex w-10/12 items-center m-auto p-2">
      <img
        className="w-16 rounded-full h-16"
        src={friend.profileImage}
        alt="프로필사진"
      />
      <TextStyle className="ml-4 text-white">
        {friend.nickname}
        <span className="text-gray-400">#{friend.userNo}</span>
      </TextStyle>
      <div className="flex ml-auto mr-3">
        <button className="w-5 mr-4" onClick={requestAccept}>
          <img src="/assets/icons/button_check.png" alt="수락" />
        </button>
        <button className="w-5" onClick={requestReject}>
          <img src="/assets/icons/button_x.png" alt="거절" />
        </button>
      </div>
    </div>
  )
}

const TextStyle = styled.div`
  font-family: "pretendard";
  font-weight: 400;
  color: ${(props) => props.theme.colorCommon};
`
const CapsuleShadow = styled.div`
  z-index: -1;
  position: absolute;
  bottom: -25px;
  left: 110px;
  width: 205px;
  height: 80px;
  border-radius: 50%;
  background: ${(props) => props.theme.colorShadow};
  filter: blur(5px);
`

const Nav = styled.div<{ isActive: boolean }>`
  position: relative;
  text-decoration: none;
  font-family: "pretendard";
  font-weight: 200;
  color: ${(props) => props.theme.colorCommon};
  transition: color 0.2s;
  display: inline-flex;
  align-items: center;
  width: 120px;
  justify-content: center;

  &::after {
    content: "";
    position: absolute;
    bottom: -10px;
    width: 100%;
    height: 1px;
    background-color: ${(props) => props.theme.colorCommon};
    display: ${(props) => (props.isActive ? "block" : "none")};
  }
`

export type FriendType = {
  userNo: number
  nickname: string
  profileImage: string
  favorite: boolean
}

export default Friend
