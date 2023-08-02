package com.b210.damda.domain.dto.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
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

    public UserDTO() {
    }
}
