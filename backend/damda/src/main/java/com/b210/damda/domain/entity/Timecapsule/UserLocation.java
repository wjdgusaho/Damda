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

    private String localBig;

    private String localMedium;

    @ManyToOne
    @JoinColumn(name = "user_no")
    private User user;

    private Timestamp weaterTime;

    private String weather;

    public UserLocation(){
    }
}
