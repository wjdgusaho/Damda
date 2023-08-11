import React from "react"
import "../index.css"
import { styled } from "styled-components"
import { useNavigate } from "react-router"
import { useSelector } from "react-redux"
import { RootState } from "../store/Store"

const Background = styled.div`
  background-image: url(${(props) => props.theme.bgImg});
  background-size: 540px;
  background-position-x: center;
  background-position-y: 60px;
  background-repeat: no-repeat;
  width: 100%;
  height: 100vh;
`

const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${(props) => props.theme.colorCommon};
  font-family: "Pretendard";
`

const MenuBtn = styled.button`
  background-color: ${(props) => props.theme.color50};
  opacity: 80%;
  width: 297px;
  height: 70px;
  font-size: 20px;
  border-radius: 15px;
  color: ${(props) => props.theme.color900};
  font-weight: 400;
  margin-bottom: 25px;
  box-shadow: 0px 4px 4px ${(props) => props.theme.color700};
`

const LogoutBtn = styled(MenuBtn)`
  background-color: ${(props) => props.theme.color900};
  opacity: 70%;
  color: ${(props) => props.theme.color100};
`

const CloseBtn = styled(MenuBtn)`
  background-color: rgb(255, 255, 255, 0);
  box-shadow: none;
`

const Menu = function () {
  const navigate = useNavigate()
  const UserData = useSelector((state: RootState) => state.auth.userInfo)
  const timecapsuleData = useSelector((state: RootState) => state.timecapsule)

  return (
    <Background>
      <Box>
        <img
          style={{
            backgroundColor: "#AEB8E2",
            borderRadius: "50%",
            width: "70px",
            height: "70px",
            marginTop: "100px",
            marginBottom: "15px",
          }}
          src={UserData.profileImage}
          alt="defautImg"
        />
        <div style={{ fontSize: "20px", fontWeight: "300" }}>
          {UserData.nickname}
        </div>
        <div style={{ opacity: "50%", fontSize: "15px", fontWeight: "100" }}>
          #{UserData.userNo}
        </div>
        <div className="grid grid-cols-2 text-base font-thin space-x-7 mt-6">
          <div
            onClick={() => {
              navigate("/timecapsule")
            }}
            className="grid grid-rows-2 text-center"
          >
            진행중인 타임캡슐
            <div className="text-xl font-normal">
              {timecapsuleData.nowCapsuleCount}개
            </div>
          </div>
          <div
            onClick={() => {
              navigate("/savetimecapsule")
            }}
            className="grid grid-rows-2 text-center"
          >
            저장된 타임캡슐
            <div className="text-xl font-normal">
              {timecapsuleData.savedCapsuleCount}개
            </div>
          </div>
        </div>
        <MenuBtn
          onClick={() => {
            navigate("/friend/list")
          }}
          style={{ marginTop: "35px" }}
        >
          내 친구
        </MenuBtn>
        <MenuBtn
          onClick={() => {
            navigate("/shop")
          }}
        >
          상점
        </MenuBtn>
        <MenuBtn
          onClick={() => {
            if (UserData.accountType === "KAKAO") {
              navigate("/user-info")
            } else {
              navigate("/user")
            }
          }}
        >
          회원정보 수정
        </MenuBtn>
        <LogoutBtn
          onClick={() => {
            navigate("/logout")
          }}
        >
          로그아웃
        </LogoutBtn>
        <CloseBtn
          onClick={() => {
            navigate("/main")
          }}
        >
          닫기
        </CloseBtn>
      </Box>
    </Background>
  )
}

export default Menu
