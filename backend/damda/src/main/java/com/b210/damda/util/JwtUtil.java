package com.b210.damda.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
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
        try {
            Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token);
            return false;  // 토큰 파싱에 성공하면, 만료되지 않았으므로 false를 반환.
        } catch (ExpiredJwtException e) {
            // 만료된 토큰으로 인해 예외가 발생하면, 만료된 것으로 간주하고 true를 반환.
            return true;
        }
    }

    public static String createAccessJwt(String email, String secretKey, Long expiredMs){
        Claims claims = Jwts.claims();
        claims.put("email", email);

        return Jwts.builder() // 토큰을 생성
                .setClaims(claims) // 유저의 이메일
                .setIssuedAt(new Date(System.currentTimeMillis())) // 현재 시간
                .setExpiration(new Date(System.currentTimeMillis() + expiredMs)) // 언제까지
                .signWith(SignatureAlgorithm.HS256, secretKey) // 뭐로 사인됐는지
                .compact();
    }

    public static String createRefreshToken(String secretKey, Long expiredMs){
        Claims claims = Jwts.claims();

        return Jwts.builder() // 토큰을 생성
                .setClaims(claims) // claim은 비어있음
                .setIssuedAt(new Date(System.currentTimeMillis())) // 현재 시간
                .setExpiration(new Date(System.currentTimeMillis() + expiredMs)) // 언제까지
                .signWith(SignatureAlgorithm.HS256, secretKey) // 어떤 키로 사인할지
                .compact();
    }
}
