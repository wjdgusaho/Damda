package com.b210.damda.domain.entity.User;

import lombok.Getter;

import javax.persistence.*;
import java.sql.Date;
import java.time.LocalDateTime;

@Getter
@Entity
public class KakaoLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long kakaoLogNo;

    @OneToOne
    @JoinColumn(name = "user_no")
    private User user;

    private LocalDateTime updateTime;

    private String accessToken;

    public KakaoLog(){
    }

    public void updateKakaoLog(String accessToken){
        this.updateTime = LocalDateTime.now();
        this.accessToken = accessToken;
    }

    public void createKakaoLog(String accessToken, User user){
        this.updateTime = LocalDateTime.now();
        this.user = user;
        this.accessToken = accessToken;
    }
}
