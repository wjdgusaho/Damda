package com.b210.damda.domain.entity.Timecapsule;

import com.b210.damda.domain.entity.User.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Getter @Setter
@Builder
@AllArgsConstructor
public class UserLocation {

    @Id  @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userLocationNo;

    @Column(name = "local_big")
    private String localBig;

    @Column(name = "local_medium")
    private String localMedium;

    @ManyToOne
    @JoinColumn(name = "user_no")
    private User user;

    private Timestamp weatherTime;

    private String weather;

    public UserLocation(){
    }
}
