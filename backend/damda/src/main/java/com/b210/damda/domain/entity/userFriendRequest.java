package com.b210.damda.domain.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@ToString
@Builder
@EntityListeners(AuditingEntityListener.class)
public class userFriendRequest {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long userFriendRequestNo;
    @Column(nullable = false)
    private boolean isCheck;
    @Column(nullable = false)
    private Long requestUserNo;
    @Column(nullable = false)
    private Long receivedUserNo;
    @Column(nullable = false)
    @CreatedDate
    private LocalDateTime requestDate;
    @Column(nullable = false)
    private String status = "NOTREAD";

    public userFriendRequest() {
    }

    public userFriendRequest(Long userFriendRequestNo, boolean isCheck, Long requestUserNo, Long receivedUserNo, LocalDateTime requestDate, String status) {
        this.userFriendRequestNo = userFriendRequestNo;
        this.isCheck = isCheck;
        this.requestUserNo = requestUserNo;
        this.receivedUserNo = receivedUserNo;
        this.requestDate = requestDate;
        this.status = status;
    }
}
