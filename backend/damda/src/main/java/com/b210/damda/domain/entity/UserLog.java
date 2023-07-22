package com.b210.damda.domain.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@ToString
@EntityListeners(AuditingEntityListener.class)
@RequiredArgsConstructor
public class UserLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userLogNo;
    @ManyToOne
    @JoinColumn(name = "userNo", nullable = false)
    private User user;
    @CreatedDate
    @Column(nullable = false)
    private LocalDateTime recentLogin;

    public void setUser(User user) {
        this.user = user;
    }
}
