import React, { useEffect, useState } from "react"
import { SubHeader } from "./inc/SubHeader"
import styled from "styled-components"

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
        <div className="flex justify-start w-96 mx-auto mt-5">
          {searchList.length === 0 ? (
            <div className="flex justify-center flex-wrap">
              <p className="text-victoria-400 text-center w-96 my-10">
                검색하려는 친구가 없어요
              </p>
              <img
                src="/assets/Astronaut-1.png"
                alt="목록없음"
                style={{ width: "15rem" }}
                className="mt-5"
              />
              <CapsuleShadow className="mx-auto"></CapsuleShadow>
            </div>
          ) : (
            <div>
              {searchList.map((user: UserInfo) => (
                <UserItem key={user.id} User={user} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const UserItem = function ({ User }: { User: UserInfo }) {
  return (
    <div
      className="grid items-center w-96 mt-2"
      style={{ gridTemplateColumns: "75px auto 85px" }}
    >
      <img
        className="rounded-full"
        style={{ width: "75px", height: "75px" }}
        src="/assets/icons/profile_1.png"
        alt="testimg"
      />
      <p className="text-white ml-2">
        {User.nickname}
        <span className="text-gray-400">#{User.id}</span>
      </p>
      <button className="bg-lilac-300 rounded-full mr-5 h-8">추가</button>
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

const CapsuleShadow = styled.div`
  width: 155px;
  height: 60px;
  border-radius: 50%;
  background: ${(props) => props.theme.colorShadow};
  filter: blur(5px);
`

type UserInfo = {
  id: number
  nickname: string
  profileImage: string
  status: string
}

export default UserSearch
