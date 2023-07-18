package com.b210.damda.domain.dto;

import com.b210.damda.domain.entity.User;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserRegistDTO {

    private String email;
    private String password;
    private String nickname;


    public User toEntity(){
        return User.builder()
                .email(email)
                .password(password)
                .nickname(nickname)
                .createDate(LocalDateTime.now().toString())
                .build();
    }
}
