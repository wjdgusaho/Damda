package com.b210.damda.util.kakaoAPI.controller;

import com.b210.damda.util.kakaoAPI.service.KakaoAPIService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.Map;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/kakaoapi")
@RequiredArgsConstructor
public class KakaoAPIController {

    private final KakaoAPIService kakaoAPIService;

//    public String getKakaAuthUrl(HttpServletRequest request) throws Exception{
//        System.out.println("testet");
//        String reqUrl = "https://kauth.kakao.com/oauth/authorize"
//                + "?client_id=9292106e6bff609d98bd0df4de1ede06"
//                //+ "&client_secret=GcveX0t6jBVJV3TT7XOxrFAc13inJUYf"
//                + "&redirect_url=http://localhost:8080/api/kakaoapi/login/oauth_kakao"
//                + "&response_type=code";
//
//        return reqUrl;
//    }

    @GetMapping("login/oauth_kakao")
    public ResponseEntity<?> oauthKakao(@RequestParam(value = "code", required = false)String code) throws IOException {
        System.out.println("#########" + code);
        String access_token = kakaoAPIService.getKakaoAccessToken(code);
        System.out.println("access_token Controller = "+ access_token);
        Map<String, Object> UserInfo =  kakaoAPIService.getKakaoUserInfo(access_token);

        return new ResponseEntity<>(UserInfo, HttpStatus.OK);
    }

}
