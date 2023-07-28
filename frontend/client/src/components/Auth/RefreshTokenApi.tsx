import axios, { AxiosRequestConfig } from 'axios'
import { serverUrl } from '../../urls'

const RefreshTokenApi = async function (refreshToken:string) {
    const config:AxiosRequestConfig = {
        headers: {
            'RefreshToken' : refreshToken
        }
    }
    try{
        const response = await axios.post(serverUrl+"user/refresh-token",{}, config)
        console.log(response);
        
        return response.data
    }
    catch (error){
        throw(error)
    }
}

// refreshTokens 함수는 서버로 리프레시 토큰을 보내고 새로운 토큰들을 받아옵니다.
export const getNewTokens = async (refreshToken:string):Promise<string> => {
    try {
      const newAccessToken = await RefreshTokenApi(refreshToken)
      return newAccessToken
    } catch (error) {
      throw error
    }
  };