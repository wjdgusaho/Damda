package com.b210.damda.domain.dto.User;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;


@Getter
@Builder
@Data
public class UserLoginSuccessDTO {

    private String accessToken;
    private String refreshToken;
    private String accountType;
    private String nickname;
    private String profileImage;
    private Long userNo;
    private int nowTheme;
    private int coin;
    private Long expiredMs;

    public UserLoginSuccessDTO(String accessToken, String refreshToken, String accountType, String nickname, String profileImage, Long userNo, int nowTheme, int coin, Long expiredMs) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.accountType = accountType;
        this.nickname = nickname;
        this.profileImage = profileImage;
        this.userNo = userNo;
        this.nowTheme = nowTheme;
        this.coin = coin;
        this.expiredMs = expiredMs;
    }
}
