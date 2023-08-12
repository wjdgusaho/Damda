import React, { useState } from "react"
import { SubHeader } from "./inc/SubHeader"
import styled from "styled-components"
import axios from "axios"
import { serverUrl } from "../urls"
import { useSelector } from "react-redux"
import { RootState } from "../store/Store"

const UserSearch = function () {
  const [searchList, setSearchList] = useState<UserInfo[]>([])
  const [searchKeyword, setSearchKeyword] = useState("")
  let token = useSelector((state: RootState) => state.auth.accessToken)

  const handleSearch = function (event: React.ChangeEvent<HTMLInputElement>) {
    setSearchKeyword(event.target.value)
  }

  const handlekeydown = function (
    event: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (event.code === "Enter") {
      getResult()
    }
  }

  const handleClick = function (event: React.MouseEvent<HTMLButtonElement>) {
    getResult()
  }

  const getResult = function () {
    let type = "invalid"
    // 1. "닉네임" + "#" + "숫자코드"
    const pattern1 = /^[a-zA-Z가-힣0-9]+#[0-9]+$/

    // 2. "#" + "숫자코드"
    const pattern2 = /^#[0-9]+$/

    // 3. "닉네임"
    const pattern3 = /^[a-zA-Z가-힣0-9]+$/

    if (pattern1.test(searchKeyword)) {
      type = "all"
    } else if (pattern2.test(searchKeyword)) {
      type = "code"
    } else if (pattern3.test(searchKeyword)) {
      type = "nickname"
    }

    if (!searchKeyword) {
      alert("검색어를 입력해주세요.")
    } else if (type === "invalid") {
      alert("검색어 형식이 올바르지 않습니다.")
    } else {
      axios({
        method: "GET",
        url: serverUrl + "user/search",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        params: {
          query: searchKeyword,
          type: type,
        },
      })
        .then((response) => {
          setSearchList(response.data.data.result)
        })
        .catch((error) => console.error(error))
    }
  }

  return (
    <>
      <SubHeader />
      <Box>
        <Title className="mt-10 text-xl">회원 검색</Title>
        <div className="relative">
          <SearchInput
            className="focus:outline-none"
            type="text"
            placeholder="닉네임 입력"
            onChange={handleSearch}
            onKeyDown={handlekeydown}
          />
          <button onClick={handleClick}>
            <SearchImg src="/assets/icons/search.png" alt="search" />
          </button>
          <div
            className="mt-3"
            style={{ fontSize: "14px", opacity: "60%", fontWeight: "300" }}
          >
            검색결과
          </div>
        </div>
        <div>
          {searchList.length === 0 ? (
            <>
              <NoResult>검색하려는 친구가 없어요</NoResult>
              <div className="relative">
                <img
                  src="/assets/universe/Astronaut-1.png"
                  alt="목록없음"
                  style={{ width: "15rem" }}
                  className="mt-20"
                />
                <CapsuleShadow className="m-auto !h-12 !w-40"></CapsuleShadow>
              </div>
            </>
          ) : (
            <>
              {searchList.map((user: UserInfo, index: number) => (
                <UserItem
                  key={index}
                  User={user}
                  searchList={searchList}
                  setSearchList={setSearchList}
                />
              ))}
            </>
          )}
        </div>
      </Box>
    </>
  )
}

const UserItem = function ({
  key,
  User,
  searchList,
  setSearchList,
}: {
  key: number
  User: UserInfo
  searchList: UserInfo[]
  setSearchList: React.Dispatch<React.SetStateAction<UserInfo[]>>
}) {
  let token = useSelector((state: RootState) => state.auth.accessToken)

  const handleRequest = function (event: React.MouseEvent<HTMLButtonElement>) {
    axios({
      method: "PATCH",
      url: serverUrl + "friend/request",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      data: {
        userNo: User.userNo,
      },
    })
      .then((response) => {
        const code = response.data.code
        alert(response.data.message)
        if (code === 200) {
          const newList = searchList.map((user) => {
            if (user.userNo === User.userNo) {
              user.status = "REQUESTED"
            }
            return user
          })
          setSearchList(newList)
        }
      })
      .catch((error) => console.error(error))
  }
  return (
    <div
      className="flex items-center justify-between mt-4"
      style={{ width: "313px" }}
    >
      <div className="flex items-center">
        <img
          style={{
            backgroundColor: "#fff",
            borderRadius: "50%",
            width: "52px",
            height: "52px",
          }}
          src={User.profileImage}
          alt="profilepic"
        />
        <span className="ml-3">{User.nickname}</span>
        <span className="ml-1" style={{ opacity: "50%", fontWeight: "300" }}>
          #{User.userNo}
        </span>
      </div>
      {(User.status === "" || User.status === "REJECTED") && (
        <Button $state={true} onClick={handleRequest}>
          추가
        </Button>
      )}
      {User.status === "RECEIVED" && (
        <GrayButton $state={false} disabled={true}>
          요청받음
        </GrayButton>
      )}
      {User.status === "REQUESTED" && (
        <GrayButton $state={false} disabled={true}>
          요청됨
        </GrayButton>
      )}
      {User.status === "ACCEPTED" && (
        <GrayButton $state={false} disabled={true}>
          친구
        </GrayButton>
      )}
    </div>
  )
}

const Box = styled.div`
  display: flex;
  flex-direction: column;
  font-family: "Pretendard";
  color: ${(props) => props.theme.colorCommon};
  align-items: center;
`

const Title = styled.div`
  font-weight: 400;
`

const SearchInput = styled.input`
  background-color: rgb(255, 255, 255, 0.7);
  height: 44px;
  width: 313px;
  border-radius: 15px;
  color: ${(props) => props.theme.color900};
  padding-left: 20px;
  margin-top: 20px;
`

const SearchImg = styled.img`
  position: absolute;
  width: 24px;
  height: 24px;
  top: 30px;
  right: 10px;
`

const NoResult = styled.div`
  font-weight: 200;
  margin-top: 50px;
  text-align: center;
  font-size: 20px;
  opacity: 60%;
`

interface ButtonProps {
  $state: boolean
}

const Button = styled.button<ButtonProps>`
  width: 67.2px;
  height: 28px;
  border-radius: 30px;
  background-color: ${(props) => props.theme.color200};
  color: ${(props) => props.theme.color900};
`

const GrayButton = styled(Button)`
  background-color: #cfcfcf;
`

const CapsuleShadow = styled.div`
  z-index: -1;
  position: absolute;
  bottom: -25px;
  left: 38.75px;
  width: 155px;
  height: 60px;
  border-radius: 50%;
  background: ${(props) => props.theme.colorShadow};
  filter: blur(5px);
`

type UserInfo = {
  userNo: number
  nickname: string
  profileImage: string
  status: string
}

export default UserSearch
