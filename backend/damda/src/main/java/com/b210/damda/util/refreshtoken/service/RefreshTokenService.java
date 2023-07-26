package com.b210.damda.util.refreshtoken.service;

import com.b210.damda.domain.entity.RefreshToken;
import com.b210.damda.util.JwtUtil;
import com.b210.damda.util.refreshtoken.repository.RefreshTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class RefreshTokenService {

    @Value("${jwt.secret}")
    private String secretKey;
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    public RefreshTokenService(RefreshTokenRepository refreshTokenRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
    }

    public String findByRefreshToken(String refreshToken){
        Optional<RefreshToken> byRefreshToken = refreshTokenRepository.findByRefreshToken(refreshToken);
        if(byRefreshToken.isEmpty()){ // 토큰과 일치하는 유저 없으면
            return "1";
        }else{
            RefreshToken refreshToken1 = byRefreshToken.get();
            if(refreshToken1.getExpirationDate().isBefore(LocalDateTime.now())){ // 리프레시 토큰 만료됐으면
                refreshToken1.setRefreshToken("");
                refreshTokenRepository.save(refreshToken1);
                return "2";
            }else{
                String accessJwt = JwtUtil.createAccessJwt(refreshToken1.getUser().getUserNo(), secretKey);
                return accessJwt;
            }
        }
    }
}
