package com.b210.damda.domain.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;

@Entity
@Getter
@ToString
@Builder
@EntityListeners(AuditingEntityListener.class)
public class userFriend {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userFrinedNo;
    @ManyToOne
    @JoinColumn(name = "user_no")
    private User user;
    @Column(nullable = false)
    private Long friendNo;
    @Column(nullable = false)
    private boolean isFavorite;
    @Column(nullable = false)
    private String status;

    public userFriend() {
    }

    public userFriend(Long userFrinedNo, User user, Long friendNo, boolean isFavorite, String status) {
        this.userFrinedNo = userFrinedNo;
        this.user = user;
        this.friendNo = friendNo;
        this.isFavorite = isFavorite;
        this.status = status;
    }
}
