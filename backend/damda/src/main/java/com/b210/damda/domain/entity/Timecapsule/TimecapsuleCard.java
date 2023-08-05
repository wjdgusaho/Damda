package com.b210.damda.domain.entity.Timecapsule;

import com.b210.damda.domain.entity.User.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Date;

@Entity
@Setter @Getter
@Builder
@AllArgsConstructor
public class TimecapsuleCard {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long timecapsuleCardNo;

    @ManyToOne
    @JoinColumn(name="timecapsule_no")
    private Timecapsule timecapsule;

    private String imagePath;

    @ManyToOne
    @JoinColumn(name="user_no")
    private User userNo;

    private Timestamp createTime;

    public TimecapsuleCard(){
    }

}
