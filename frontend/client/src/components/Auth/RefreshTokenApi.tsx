<<<<<<< HEAD
import axios, { AxiosRequestConfig } from "axios"
=======
npimport axios, { AxiosRequestConfig } from "axios"
import { serverUrl } from "../../urls"
>>>>>>> develop
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
      process.env.REACT_APP_SERVER_URL + "user/refresh-token",
      {},
      config
    )

    return response.data.data
  } catch (error) {
    throw error
  }
}

// refreshTokens 함수는 서버로 리프레시 토큰을 보내고 새로운 토큰들을 받아옵니다.
export const GetNewTokens = () => {
  const dispatch = useDispatch()
  const GetNewTokenComponent = async (
    refreshToken: string
  ): Promise<string> => {
    try {
      const { accessToken } = await RefreshTokenApi(refreshToken)
      dispatch(SET_TOKEN(accessToken))
      return accessToken
    } catch (error) {
      throw error
    }
  }
  return GetNewTokenComponent
}
