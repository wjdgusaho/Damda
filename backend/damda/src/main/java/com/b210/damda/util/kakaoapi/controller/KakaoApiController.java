package com.b210.damda.util.kakaoapi.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController("/api/kakaoapi")
public class KakaoApiController {
    @GetMapping("login")
    public void kakaoLogin() throws IOException {

    }

}
