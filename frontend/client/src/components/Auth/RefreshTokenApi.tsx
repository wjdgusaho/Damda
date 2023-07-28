import axios, { AxiosRequestConfig } from "axios"
import { serverUrl } from "../../urls"
import { useDispatch } from "react-redux"
import { SET_TOKEN } from "../../store/Auth"

const RefreshTokenApi = async function (refreshToken: string) {
  const config: AxiosRequestConfig = {
    headers: {
      RefreshToken: refreshToken,
    },
  }
  try {
    const response = await axios.post(
      serverUrl + "user/refresh-token",
      {},
      config
    )

    return response.data
  } catch (error) {
    throw error
  }
}

// refreshTokens 함수는 서버로 리프레시 토큰을 보내고 새로운 토큰들을 받아옵니다.
export const GetNewTokens = async (refreshToken: string) => {
  const dispatch = useDispatch()
  try {
    const newAccessToken = await RefreshTokenApi(refreshToken)
    dispatch(SET_TOKEN(newAccessToken))
  } catch (error) {
    throw error
  }
}
