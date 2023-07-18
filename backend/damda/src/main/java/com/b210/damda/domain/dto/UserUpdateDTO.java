package com.b210.damda.domain.dto;

import com.b210.damda.domain.entity.User;
import lombok.Data;

@Data
public class UserUpdateDTO {

    private String password;
    private String nickname;

}
