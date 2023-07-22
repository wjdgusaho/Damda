package com.b210.damda.domain.dto;

import com.b210.damda.domain.entity.User;
import lombok.Data;

@Data
public class UserOriginRegistDTO {

    private String email;
    private String userPw;
    private String nickname;
    private String profileImage;



    public User toEntity(){
        return User.builder()
                .accountType("ORIGIN")
                .email(email)
                .userPw(userPw)
                .nickname(nickname)
                .profileImage(profileImage)
                .build();
    }
}
