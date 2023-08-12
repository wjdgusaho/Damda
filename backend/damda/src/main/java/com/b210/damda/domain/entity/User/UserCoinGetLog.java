package com.b210.damda.domain.entity.User;

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
public class UserCoinGetLog {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long UserCoinLogNo;
    @ManyToOne
    @JoinColumn(name = "user_no")
    private User user;
    @CreatedDate
    @Column(nullable = false)
    private LocalDateTime getDate;
    @Column(nullable = false)
    private int getCoin;
    @Column(nullable = false)
    private String type;

    public UserCoinGetLog() {
    }

    public UserCoinGetLog(Long userCoinLogNo, User user, LocalDateTime getDate, int getCoin, String type) {
        UserCoinLogNo = userCoinLogNo;
        this.user = user;
        this.getDate = getDate;
        this.getCoin = getCoin;
        this.type = type;
    }

    public UserCoinGetLog(User user, int getCoin, String type) {
        this.user = user;
        this.getCoin = getCoin;
        this.type = type;
    }
}
