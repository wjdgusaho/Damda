package com.b210.damda.domain.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Builder
@ToString
public class RefreshToken {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long refreshTokenId;
    private Long Id;
    private String refreshToken;
    private LocalDateTime expirationDate;
    private LocalDateTime createDate;

    public RefreshToken() {

    }
}
