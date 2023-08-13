package com.b210.damda.domain.entity.User;

import javax.persistence.*;

@Entity
public class UserEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userEventNo;

    //일단 OneToOne 연관관계를 하지는 않았음(쓸 일이 없을 거 같아서)
    @Column(name = "user_no")
    private Long userNo;

    @Column(name = "is_check")
    private int isCheck;

}
