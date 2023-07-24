package com.b210.damda.util.kakaoAPI.controller;

import com.b210.damda.domain.user.repository.UserRepository;
import com.b210.damda.util.kakaoAPI.service.KakaoAPIService;
import com.b210.damda.util.kakaoAPI.service.PrincipalDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.Map;

@CrossOrigin("*")
@RestController
@RequiredArgsConstructor
public class KakaoAPIController {

    //private final KakaoAPIService kakaoAPIService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

//    @GetMapping("login/oauth_kakao")
//    public ResponseEntity<?> oauthKakao(@RequestParam(value = "code", required = false)String code) throws IOException {
//        System.out.println("#########" + code);
//        String access_token = kakaoAPIService.getKakaoAccessToken(code);
//        System.out.println("access_token Controller = "+ access_token);
//        Map<String, Object> UserInfo =  kakaoAPIService.getKakaoUserInfo(access_token);
//
//        return new ResponseEntity<>(UserInfo, HttpStatus.OK);
//    }


}
