package com.b210.damda.domain.entity;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@ToString
@EntityListeners(AuditingEntityListener.class)
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
    @CreatedDate
    private LocalDateTime createTime;

    public EmailSendLog() {

    }

}
