package com.b210.damda.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import java.util.Date;

public class JwtUtil {

    // 유저 이메일 꺼내기
    public static String getUserEmail(String token, String secretKey){
        return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token)
                .getBody().get("email", String.class);
    }

    // 토큰 만료 체크
    public static boolean isExpired(String token, String secretKey){
        return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token)
                .getBody().getExpiration().before(new Date());
        // 만료 기간이 지금 시간보다 전이면 만료가 된 상태이다.
    }

    public static String createJwt(String email, String secretKey, Long expiredMs){
        Claims claims = Jwts.claims();
        claims.put("email", email);

        return Jwts.builder() // 토큰을 생성
                .setClaims(claims) // 유저의 이메일
                .setIssuedAt(new Date(System.currentTimeMillis())) // 현재 시간
                .setExpiration(new Date(System.currentTimeMillis() + expiredMs)) // 언제까지
                .signWith(SignatureAlgorithm.HS256, secretKey) // 뭐로 사인됐는지
                .compact();
    }
}
