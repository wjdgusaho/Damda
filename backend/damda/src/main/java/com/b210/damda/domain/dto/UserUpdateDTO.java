package com.b210.damda.domain.dto;

import com.b210.damda.domain.entity.User;
import lombok.Data;

@Data
public class UserUpdateDTO {

    private String email;
    private String userPw;
    private String nickname;

}
