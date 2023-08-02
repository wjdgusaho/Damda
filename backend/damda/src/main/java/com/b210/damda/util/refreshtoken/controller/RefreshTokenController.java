package com.b210.damda.util.refreshtoken.controller;

import com.b210.damda.util.refreshtoken.service.RefreshTokenService;
import com.b210.damda.util.response.DataResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;


@RequestMapping("user")
@RestController
public class RefreshTokenController {

    private RefreshTokenService refreshTokenService;

    @Autowired
    public RefreshTokenController(RefreshTokenService refreshTokenService) {
        this.refreshTokenService = refreshTokenService;
    }

    @PostMapping("refresh-token")
    public DataResponse<Map<String, Object>> reloadRefresh(@RequestHeader(value = "RefreshToken") String refreshToken){

        String parsingToken = refreshToken.split(" ")[0];

        String token = refreshTokenService.findByRefreshToken(parsingToken);

        if(token.equals("2")){ // 리프레시 토큰 만료
            return new DataResponse<>(400, "리프레쉬 토큰 만료.");
        }else{ // 액세스 토큰 새로 발급
            Map<String, Object> result = new HashMap<>();
            result.put("accessToken", token);

            DataResponse<Map<String, Object>> response = new DataResponse<>(200, "액세스 토큰 발급.");
            response.setData(result);

            return response;
        }

    }
}
