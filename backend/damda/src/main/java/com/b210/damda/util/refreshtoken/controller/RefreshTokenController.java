package com.b210.damda.util.refreshtoken.controller;

import com.b210.damda.util.refreshtoken.service.RefreshTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RequestMapping("user")
@RestController
public class RefreshTokenController {

    private RefreshTokenService refreshTokenService;

    @Autowired
    public RefreshTokenController(RefreshTokenService refreshTokenService) {
        this.refreshTokenService = refreshTokenService;
    }

    @PostMapping("refresh-token")
    public ResponseEntity<?> reloadRefresh(@RequestHeader(value = "RefreshToken") String refreshToken){

        String parsingToken = refreshToken.split(" ")[1];

        String token = refreshTokenService.findByRefreshToken(parsingToken);
        if(token.equals("1")){ // 토큰과 일치하는 유저 없으면
            return new ResponseEntity<>("잘못된 접근", HttpStatus.BAD_REQUEST);
        }else if(token.equals("2")){ // 리프레시 토큰 만료
            return new ResponseEntity<>("리프레시 토큰 만료", HttpStatus.BAD_REQUEST);
        }else{ // 액세스 토큰 새로 발급
            return new ResponseEntity<>(token, HttpStatus.OK);
        }

    }
}
