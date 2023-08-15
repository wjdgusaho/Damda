package com.b210.damda.domain.entity.User;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class UserCoinUseLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userCoinLogNo;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_no")
    private User user;
    @CreatedDate
    @Column(nullable = false)
    private LocalDateTime buyingDate;
    @Column(nullable = false)
    private Long buyingNo;
    @Column(nullable = false)
    private int price;
    @Column(nullable = false)
    private String type;

    @Builder
    public UserCoinUseLog(User user, Long buyingNo, int price, String type){
        this.user = user;
        this.buyingNo = buyingNo;
        this.price = price;
        this.type = type;
    }



}
