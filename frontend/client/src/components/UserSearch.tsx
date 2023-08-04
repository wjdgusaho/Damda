import React, { useState } from "react"
import { SubHeader } from "./inc/SubHeader"
import styled from "styled-components"
import axios from "axios"
import { serverUrl } from "../urls"
import { useSelector } from "react-redux"
import { RootState } from "../store/Store"
import tw from "tailwind-styled-components"

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
    <div>
      <SubHeader></SubHeader>
      <div>
        <div className="text-center mt-10">
          <TextStyle className="text-xl">회원 검색</TextStyle>
        </div>
        <div className="flex justify-center">
          <div className="bg-white bg-opacity-70 rounded-2xl w-96 h-12 mt-8 flex justify-between items-center">
            <img
              src="/assets/icons/search.png"
              alt="search"
              style={{ width: "30px", height: "30px", marginLeft: "5px" }}
            />
            <SearchInput
              className="focus:outline-none"
              type="text"
              placeholder="닉네임"
              onChange={handleSearch}
              onKeyDown={handlekeydown}
            />
            <button
              className="mr-3 rounded-full bg-lilac-300 w-12 h-8"
              onClick={handleClick}
            >
              검색
            </button>
          </div>
        </div>
        <div className="opacity-60 text-white text-center pr-80 mt-4">
          검색결과
        </div>
        <div className="flex justify-start w-96 mx-auto mt-5">
          {searchList.length === 0 ? (
            <div className="flex justify-center flex-wrap">
              <p className="text-victoria-400 text-center w-96 my-10">
                검색하려는 친구가 없어요
              </p>
              <img
                src="/assets/universe/Astronaut-1.png"
                alt="목록없음"
                style={{ width: "15rem" }}
                className="mt-5"
              />
              <CapsuleShadow className="mx-auto"></CapsuleShadow>
            </div>
          ) : (
            <div>
              {searchList.map((user: UserInfo) => (
                <UserItem key={user.userNo} User={user} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const UserItem = function ({ User }: { User: UserInfo }) {
  let token = useSelector((state: RootState) => state.auth.accessToken)

  const handleRequest = function (event: React.MouseEvent<HTMLButtonElement>) {
    axios({
      method: "POST",
      url: serverUrl + "user/request-friend",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      data: {
        id: User.userNo,
      },
    })
      .then((response) => {
        // 응답값 확인 후 적용하기.
        console.log(response)
        User.status = "REQUESTED"
      })
      .catch((error) => console.error(error))
  }
  return (
    <div
      className="grid items-center w-96 mt-2"
      style={{ gridTemplateColumns: "75px auto 85px" }}
    >
      <img
        className="rounded-full"
        style={{ width: "75px", height: "75px" }}
        src={User.profileImage}
        alt="profile"
      />
      <p className="text-white ml-2">
        {User.nickname}
        <span className="text-gray-400">#{User.userNo}</span>
      </p>
      {(User.status === "" || User.status === "REJECTED") && (
        <Button $state={true} onClick={handleRequest}>
          추가
        </Button>
      )}
      {User.status === "RECEIVED" && (
        <Button $state={false} disabled={true}>
          요청받음
        </Button>
      )}
      {User.status === "REQUESTED" && (
        <Button $state={false} disabled={true}>
          요청됨
        </Button>
      )}
      {User.status === "ACCEPTED" && (
        <Button $state={false} disabled={true}>
          친구
        </Button>
      )}
    </div>
  )
}

const TextStyle = styled.div`
  font-family: "pretendard";
  font-weight: 400;
  color: ${(props) => props.theme.colorCommon};
`

const SearchInput = styled.input`
  background-color: transparent;
  width: 16rem;
  height: inherit;
  color: #3b396f;
  &::placeholder {
    color: #3b396f;
    opacity: 0.6;
  }
`

interface ButtonProps {
  $state: boolean
}

const Button = tw.button<ButtonProps>`rounded-full ml-2 h-8
${(props) => (props.$state ? "bg-lilac-300" : "bg-gray-400")}
`

const CapsuleShadow = styled.div`
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
