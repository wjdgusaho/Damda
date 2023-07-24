package com.b210.damda.util.kakaoAPI.service;

import com.b210.damda.domain.entity.User;
import com.b210.damda.util.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;


@Slf4j
public class JwtSuccessHandler implements AuthenticationSuccessHandler {

    //@Value("${jwt.secret}")
    private String secretKey = "hihihellohello423hellohello3214321sadgfpods51akfopdskapohjpodsafjpods";

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {

        PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();

        User UserInfo = principalDetails.getUser(); //PrincipalDetails에서 사용자 정보 가져오기.

        log.info(UserInfo.toString());

        Map<String, String> tokens = new HashMap<>();

        log.info(secretKey);

        // 로그인 성공
        String jwtToken = JwtUtil.createAccessJwt(UserInfo.getUserNo(), secretKey); // 토큰 발급해서 넘김
        String refreshToken = JwtUtil.createRefreshToken(secretKey); // 리프레시 토큰 발급해서 넘김

        tokens.put("accessToken", jwtToken);
        tokens.put("refreshToken", refreshToken);

        response.setHeader("accessToken",  tokens.get("accessToken"));
        response.setHeader("refreshToken", tokens.get("refreshToken"));

        response.sendRedirect("http://localhost:3000/main");

    }
}
