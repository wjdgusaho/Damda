package com.b210.damda.domain.dto;

import com.b210.damda.domain.entity.User;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

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
