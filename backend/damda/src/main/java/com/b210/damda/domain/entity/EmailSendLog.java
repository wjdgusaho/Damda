package com.b210.damda.domain.entity;

import com.b210.damda.domain.entity.User.User;
import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@ToString
@Builder
@AllArgsConstructor
public class EmailSendLog {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long emailSendLogNo;
    @ManyToOne
    @JoinColumn(name = "userNo", nullable = false)
    private User user;
    @Column(nullable = false)
    private String email;
    @Column(nullable = false)
    private String verificationCode;
    @Column(nullable = false)
    private LocalDateTime createTime;
    @Column(nullable = false)
    private LocalDateTime expiryTime;
    @Column(nullable = false)
    private boolean used;

    public EmailSendLog() {

    }

    public void setUsed(boolean used) {
        this.used = used;
    }
}
