package com.b210.damda.domain.dto.User;

import lombok.Data;

@Data
public class UserUpdateDTO {

    private String userPw;
    private String nickname;
    private String email;

}
