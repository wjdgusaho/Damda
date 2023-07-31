import axios, { AxiosRequestConfig } from "axios"
import { serverUrl } from "../../urls"
import { useDispatch } from "react-redux"
import { SET_TOKEN } from "../../store/Auth"

// refreshTokens 함수는 서버로 리프레시 토큰을 보내고 새로운 토큰들을 받아옵니다.
export const GetNewTokens = () => {
  const dispatch = useDispatch()

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
  const GetNewTokenComponent = async (refreshToken: string) => {
    try {
      const newAccessToken = await RefreshTokenApi(refreshToken)
      dispatch(SET_TOKEN(newAccessToken))
    } catch (error) {
      throw error
    }
  }
  return GetNewTokenComponent
}
