package com.b210.damda.domain.entity;

import com.b210.damda.domain.dto.UserUpdateDTO;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.time.LocalDateTime;

@Entity
@Getter
@ToString
@Builder
public class User {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String email;
    private String password;
    private String nickname;
    private LocalDateTime createDate;
    private LocalDateTime updateDate;

    public User() {
    }

    public User(Long id, String email, String password, String nickname, LocalDateTime createDate, LocalDateTime updateDate) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.nickname = nickname;
        this.createDate = createDate;
        this.updateDate = updateDate;
    }

    public void updatePassword(String newPassword) {
        this.updateDate = LocalDateTime.now();
        this.password = newPassword;
    }

    public void updateNickname(String newNickname) {
        this.updateDate = LocalDateTime.now();
        this.nickname = newNickname;
    }
}
