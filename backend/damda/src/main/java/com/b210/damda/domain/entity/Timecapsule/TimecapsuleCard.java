package com.b210.damda.domain.entity.Timecapsule;

import com.b210.damda.domain.dto.Timecapsule.TimecapsuleCardDTO;
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
    private User user;

    private Timestamp createTime;

    public TimecapsuleCard(){
    }

    public TimecapsuleCardDTO toTimecapsuleCardDTO(){
        return TimecapsuleCardDTO.builder()
                .timecapsuleCardNo(this.timecapsuleCardNo)
                .timecapsuleNo(this.timecapsule.getTimecapsuleNo())
                .imagePath(this.imagePath)
                .userNo(this.user.getUserNo())
                .createTime(this.createTime)
                .build();
    }
}
