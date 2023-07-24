package com.b210.damda.util.kakaoAPI.service;

public interface OAuth2UserInfo {
    String getProviderId();
    String getProvider();
    String getEmail();
    String getName();
}
