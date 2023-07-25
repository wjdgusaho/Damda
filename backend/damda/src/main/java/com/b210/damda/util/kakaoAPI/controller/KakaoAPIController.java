package com.b210.damda.util.kakaoAPI.controller;

import com.b210.damda.domain.entity.User;
import com.b210.damda.domain.user.repository.UserRepository;
import com.b210.damda.util.JwtUtil;
import com.b210.damda.util.kakaoAPI.service.KakaoAPIService;
import com.b210.damda.util.kakaoAPI.service.PrincipalDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@CrossOrigin("*")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/kakao")
public class KakaoAPIController {


    @Value("${jwt.secret}")
    private String secretKey;

    @GetMapping("login")
    public ResponseEntity<?> kakaoLogin(Authentication authentication) throws IOException {

        PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();

        User UserInfo = principalDetails.getUser(); //PrincipalDetails에서 사용자 정보 가져오기

        // 로그인 성공
        String jwtToken = JwtUtil.createAccessJwt(UserInfo.getUserNo(), secretKey); // 토큰 발급해서 넘김
        String refreshToken = JwtUtil.createRefreshToken(secretKey); // 리프레시 토큰 발급해서 넘김

        Map<String, String> tokens = new HashMap<>();

        tokens.put("accessToken", jwtToken);
        tokens.put("refreshToken", refreshToken);

        return new ResponseEntity<>(tokens, HttpStatus.OK);
    }

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
