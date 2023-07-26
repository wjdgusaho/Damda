package com.b210.damda.domain.user.filter;

import com.b210.damda.domain.user.service.UserService;
import com.b210.damda.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@RequiredArgsConstructor
@Slf4j
public class JwtFilter extends OncePerRequestFilter { // 모든 요청에 대해 토큰 유효성 검증을 진행

    private final UserService userService;
    private final String secretKey;

    @Override // 이 주소로 오는 건 토큰 없어도 됨.
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        return path.startsWith("/user/login") || path.startsWith("/user/regist") || path.startsWith("/user/change-password/email")
                || path.startsWith("/user/logout") || path.startsWith("/user/change-password/code") || path.startsWith("/api/kakao/login") || path.startsWith("/user/check-email")
                || path.startsWith("/user/change-password/new") || path.startsWith("/user/refresh-token");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        final String authorization = request.getHeader(HttpHeaders.AUTHORIZATION);
        log.info("authorization : {}", authorization);



        // 토큰이 없거나 Bearer로 시작하지 않는 경우
        if(authorization == null || !authorization.startsWith("Bearer ")){
            log.error("authorization을 잘못 보냈습니다.");
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "토큰을 잘못 보냈습니다");
            return;
        }

        // 토큰 꺼내기(첫 번째가 토큰이다. bearer 제외)
        String token = authorization.split(" ")[1];


        // 토큰 만료됐는지 확인
        if(JwtUtil.isExpired(token, secretKey)){
            log.error("토큰이 만료되었습니다.");
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "토큰 만료");
            return;
        }

        // userId 토큰에서 꺼냄.
        Long userId = JwtUtil.getUserNo(token, secretKey);
        log.info("userId:{}", userId);

        // 권한 부여
        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(userId, null, List.of(new SimpleGrantedAuthority("USER")));
        // Detail을 넣어준다.
        authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authenticationToken);
        filterChain.doFilter(request, response);
    }
}
