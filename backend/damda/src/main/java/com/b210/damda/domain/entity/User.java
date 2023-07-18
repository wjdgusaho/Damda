package com.b210.damda.domain.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

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
    private String createDate;

    public User() {
    }

    public User(Long id, String email, String password, String nickname, String createDate) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.nickname = nickname;
        this.createDate = createDate;
    }
}
