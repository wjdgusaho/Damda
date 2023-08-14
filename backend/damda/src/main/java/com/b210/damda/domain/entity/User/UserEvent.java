package com.b210.damda.domain.entity.User;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class UserEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userEventNo;
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_no")
    private User user;
    @Column(name = "is_check", nullable = false)
    private Boolean isCheck = false;

    @Builder
    public UserEvent(User user) {
        this.user = user;
    }

    public void updateIsCheck(){
        this.isCheck = true;
    }
}
