package com.b210.damda.domain.dto.User;

import com.b210.damda.domain.entity.User.User;
import lombok.Data;

@Data
public class UserOriginRegistDTO {

    private String email;
    private String userPw;
    private String nickname;
    private String uri;



    public User toEntity(){
        return User.builder()
                .accountType("ORIGIN")
                .email(email)
                .userPw(userPw)
                .profileImage(uri)
                .nickname(nickname)
                .build();
    }
}
