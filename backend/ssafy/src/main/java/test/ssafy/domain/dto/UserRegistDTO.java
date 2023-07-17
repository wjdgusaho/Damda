package test.ssafy.domain.dto;

import lombok.Builder;
import lombok.Data;
import test.ssafy.domain.entity.User;

import java.time.LocalDateTime;

@Data
public class UserRegistDTO {

    private String email;
    private String nickname;
    private String password;

    public UserRegistDTO() {
    }

    public UserRegistDTO(String email, String nickname, String password) {
        this.email = email;
        this.nickname = nickname;
        this.password = password;
    }

    public User toEntity(){
        return User.builder()
                .email(email)
                .nickname(nickname)
                .password(password)
                .registDate(LocalDateTime.now().toString())
                .build();
    }


}
