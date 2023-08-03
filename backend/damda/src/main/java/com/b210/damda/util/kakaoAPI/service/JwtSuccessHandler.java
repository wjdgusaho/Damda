package com.b210.damda.util.kakaoAPI.service;

import com.b210.damda.domain.entity.User.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@RequiredArgsConstructor
@Slf4j
public class JwtSuccessHandler implements AuthenticationSuccessHandler {

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
        User UserInfo = principalDetails.getUser(); //PrincipalDetails에서 사용자 정보 가져오기

        String userCode = UserInfo.getUserPw();

        response.sendRedirect("https://i9b210.p.ssafy.io/dummykakao?code=" + userCode);
    }
}
