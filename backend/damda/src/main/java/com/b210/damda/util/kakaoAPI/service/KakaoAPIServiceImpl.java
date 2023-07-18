package com.b210.damda.util.kakaoapi.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Map;

@Service
public class KakaoAPIServiceImpl implements KakaoAPIService{

    public KakaoAPIServiceImpl(){}

    @Override
    public String getKakaoAccessToken(String authorize_code) {
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
            sb.append("&redirect_uri=http://localhost:8080/login/oauth_kaka0");
            sb.append("&code=" + authorize_code);
            bw.write(sb.toString());
            bw.flush();

            //결과 코드가 200이라면 성공
            int responseCode = conn.getResponseCode();
            System.out.println("responseCode : " + responseCode);

            //요청을 통해 얻은 JSON타입의 Response 메세지 읽어오기
            BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));

            String line = "";
            String result = "";

            while((line = br.readLine()) != null){
                result += line;
            }
            System.out.println("response body : " + result);

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
        }
        catch(IOException e){
            e.printStackTrace();
        }
        return access_Token;
    }
}