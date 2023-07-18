package com.b210.damda.util.kakaoAPI.service;

import java.io.IOException;
import java.util.Map;

public interface KakaoAPIService {
    public String getKakaoAccessToken(String authorize_code);

    Map<String, Object> getKakaoUserInfo(String access_token);
}
