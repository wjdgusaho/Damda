package com.b210.damda.util.refreshtoken.service;

import com.b210.damda.domain.entity.RefreshToken;
import com.b210.damda.util.JwtUtil;
import com.b210.damda.util.exception.CommonException;
import com.b210.damda.util.exception.CustomExceptionStatus;
import com.b210.damda.util.refreshtoken.repository.RefreshTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional
    public String findByRefreshToken(String refreshToken){
        Optional<RefreshToken> byRefreshToken = Optional.ofNullable(refreshTokenRepository.findByRefreshToken(refreshToken)
                .orElseThrow(() -> new CommonException(CustomExceptionStatus.NOT_FOUND_JWT_TOKEN)));

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
