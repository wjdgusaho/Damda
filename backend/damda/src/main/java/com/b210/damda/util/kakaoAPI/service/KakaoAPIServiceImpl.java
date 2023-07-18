package com.b210.damda.util.kakaoAPI.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.stereotype.Service;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
public class KakaoAPIServiceImpl implements KakaoAPIService{

    public KakaoAPIServiceImpl(){}

    @Override
    public String getKakaoAccessToken(String authorize_code){
        String access_Token = "";
        String refresh_Token = "";

        String reqURL = "https://kauth.kakao.com/oauth/token";

        try{
            URL url = new URL(reqURL);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setDoOutput(true);

            BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(conn.getOutputStream()));
            StringBuilder sb = new StringBuilder();

            //POST 요청에 필요로 요구하는 파라미터 스트림을 통해 전송
            sb.append("grant_type=authorization_code");
            sb.append("&client_id=9292106e6bff609d98bd0df4de1ede06");
            sb.append("&client_secret=GcveX0t6jBVJV3TT7XOxrFAc13inJUYf");
            sb.append("&redirect_uri=http://localhost:8080/api/kakaoapi/login/oauth_kakao");
            sb.append("&code=" + authorize_code);
            bw.write(sb.toString());
            bw.flush();

            //결과 코드가 200이라면 성공
            int responseCode = conn.getResponseCode();
            log.info("responseCode : " + responseCode);

            //요청을 통해 얻은 JSON타입의 Response 메세지 읽어오기
            BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));

            String line = "";
            String result = "";

            while((line = br.readLine()) != null){
                result += line;
            }
            log.info("response body : " + result);

            // jackson objectmapper 객체 생성
            ObjectMapper objectMapper = new ObjectMapper();

            // JSON String -> Map
            Map<String, Object> jsonMap = objectMapper.readValue(
                    result, new TypeReference<Map<String, Object>>() {
                    });

            access_Token = jsonMap.get("access_token").toString();
            refresh_Token = jsonMap.get("refresh_token").toString();
            br.close();
            bw.close();
            log.info("access 토큰 = " + access_Token);
        }
        catch(IOException e){
            e.printStackTrace();
        }
        finally{
            return access_Token;
        }
    }

    @Override
    public Map<String, Object> getKakaoUserInfo(String access_token){
        String reqUrl = "https://kapi.kakao.com/v2/user/me";
        Map<String, Object> userInfo = new HashMap<>();

        try{
            URL url = new URL(reqUrl);

            HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();
            urlConnection.setRequestProperty("Authorization", "Bearer " + access_token);
            urlConnection.setRequestMethod("GET");

            int responseCode = urlConnection.getResponseCode();
            log.info("responseCode = " + responseCode);

            BufferedReader br = new BufferedReader(new InputStreamReader(urlConnection.getInputStream()));
            String line = "";
            String result = "";
            while((line=br.readLine())!=null)
            {
                result+=line;
            }
            log.info("result = " + result);

            JSONParser parser = new JSONParser();
            JSONObject obj = (JSONObject) parser.parse(result);
            JSONObject kakao_account = (JSONObject) obj.get("kakao_account");
            JSONObject properties = (JSONObject) obj.get("properties");
            JSONObject has_email = (JSONObject) obj.get("has_email");

            log.info("kakao_account = " + kakao_account);
            log.info("properties = " + properties);
            log.info("has_email = " + has_email);

            String nickname = properties.get("nickname").toString();
            String profile_image = properties.get("profile_image").toString();
            String user_email = has_email.get("email").toString();
            userInfo.put("nickname", nickname);
            userInfo.put("profile_image", profile_image);
            userInfo.put("user_email", user_email);

            br.close();
        }
        catch (IOException e){
            e.printStackTrace();
        }
        finally{
            return userInfo;
        }
    }
}
