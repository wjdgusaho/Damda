import React, { useEffect, useState } from "react"
import { SubHeader } from "./inc/SubHeader"
import styled from "styled-components"

type UserInfo = {
  id: number
  nickname: string
  profileImage: string
  status: string
}

const UserSearch = function () {
  const [searchList, setSearchList] = useState<UserInfo[]>([])

  useEffect(() => {
    setSearchList([
      {
        id: 1,
        nickname: "달토끼맛쿠키",
        profileImage: "/assets/icons/profile_1.png",
        status: "NOTREAD",
      },
      {
        id: 2,
        nickname: "달토끼맛쿠키",
        profileImage: "/assets/icons/profile_1.png",
        status: "NOTREAD",
      },
    ])
  }, [])

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
              style={{ width: "40px", height: "40px" }}
            />
            <SearchInput
              className="focus:outline-none"
              type="text"
              placeholder="닉네임"
            />
          </div>
        </div>
        <div className="opacity-60 text-white text-center pr-80 mt-4">
          검색결과
        </div>
        <div className="flex justify-center"></div>
      </div>
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
  width: 21rem;
  height: inherit;
  color: #3b396f;
  &::placeholder {
    color: #3b396f;
    opacity: 0.6;
  }
`

type UserType = {
  id: number
  nickname: string
  profileImage: string
  status: string
}

export default UserSearch
