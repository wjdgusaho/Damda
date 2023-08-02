package com.b210.damda.domain.entity;

import com.b210.damda.domain.entity.User.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Builder
@ToString
@EntityListeners(AuditingEntityListener.class)
@AllArgsConstructor
public class RefreshToken {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long refreshTokenId;
    @OneToOne
    @JoinColumn(name = "userNo")
    private User user;
    @Column(nullable = false)
    private String refreshToken;
    @Column(nullable = false)
    private LocalDateTime expirationDate;
    @CreatedDate
    @Column(nullable = false)
    private LocalDateTime createDate;

    public RefreshToken() {

    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public void setExpirationDate(LocalDateTime expirationDate) {
        this.expirationDate = expirationDate;
    }

    public void setCreateDate(LocalDateTime createDate) {
        this.createDate = createDate;
    }
}
