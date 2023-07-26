//package com.b210.damda.util.refreshtoken.service;
//
//import com.b210.damda.domain.entity.RefreshToken;
//import com.b210.damda.util.refreshtoken.repository.RefreshTokenRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.core.parameters.P;
//import org.springframework.stereotype.Service;
//
//import java.util.Optional;
//
//@Service
//public class RefreshTokenService {
//
//    private RefreshTokenRepository refreshTokenRepository;
//
//    @Autowired
//    public RefreshTokenService(RefreshTokenRepository refreshTokenRepository) {
//        this.refreshTokenRepository = refreshTokenRepository;
//    }
//
//    public int findByRefreshToken(String refreshToken){
//        Optional<RefreshToken> byRefreshToken = refreshTokenRepository.findByRefreshToken(refreshToken);
//        if(byRefreshToken.isEmpty()){
//            return 1;
//        }else{
//            RefreshToken refreshToken1 = byRefreshToken.get();
//        }
//    }
//}
