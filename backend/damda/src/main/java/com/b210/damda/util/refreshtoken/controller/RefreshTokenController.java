//package com.b210.damda.util.refreshtoken.controller;
//
//import com.b210.damda.domain.entity.RefreshToken;
//import com.b210.damda.domain.repository.RefreshTokenRepository;
//import com.b210.damda.util.refreshtoken.service.RefreshTokenService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestHeader;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import java.time.LocalDateTime;
//import java.util.Optional;
//
//@RequestMapping("user")
//@RestController
//public class RefreshTokenController {
//
//    private RefreshTokenService refreshTokenService;
//
//    @Autowired
//    public RefreshTokenController(RefreshTokenService refreshTokenService) {
//        this.refreshTokenService = refreshTokenService;
//    }
//
//    @PostMapping("refresh-token")
//    public ResponseEntity<?> reloadRefresh(@RequestHeader(value = "RefreshToken") String refreshToken){
//        int result = refreshTokenService.findByRefreshToken(refreshToken);
//
//    }
//}
