package com.b210.damda.domain.entity.User;

import lombok.Getter;
import lombok.ToString;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@ToString
@EntityListeners(AuditingEntityListener.class)
public class UserFriend {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userFriendNo;
    @ManyToOne
    @JoinColumn(name = "user_no")
    private User user;
    @ManyToOne
    @JoinColumn(name = "friend_no")
    private User friend;
    @Column(nullable = false)
    private boolean isFavorite;
    @Column(nullable = false)
    private String status = "";
    @Column(nullable = false)
    @CreatedDate
    private LocalDateTime requestDate;
    @Column(nullable = true)
    private LocalDateTime responseDate;

    public UserFriend() {
    }

    public UserFriend(Long userFriendNo, User user, User friend, boolean isFavorite, String status, LocalDateTime requestDate, LocalDateTime responseDate) {
        this.userFriendNo = userFriendNo;
        this.user = user;
        this.friend = friend;
        this.isFavorite = isFavorite;
        this.status = status;
        this.requestDate = requestDate;
        this.responseDate = responseDate;
    }

    public void updateRequest(User user, User friend){
        this.status = "REQUESTED";
        this.requestDate = LocalDateTime.now();
        this.user = user;
        this.friend = friend;
    }

    // 즐겨찾기 추가
    public void updateFavoriteAdd(){
        this.isFavorite = true;
    }

    // 즐겨찾기 제거
    public void updateFavoriteDel(){
        this.isFavorite = false;
    }
}
