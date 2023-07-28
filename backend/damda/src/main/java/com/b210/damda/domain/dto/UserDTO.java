package com.b210.damda.domain.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserDTO {

    private Long userNo;
    private String accountType;
    private String email;
    private String nickname;
    private String profileImage;
    private int coin;
    private int nowTheme;
    private int maxCapsuleCount;
    private int nowCapsuleCount;
}
