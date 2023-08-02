package com.b210.damda.domain.entity.Timecapsule;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;

@Entity
@Setter @Getter
public class TimecapsuleCard {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long timecapsuleCardNo;

    @ManyToOne
    @JoinColumn(name="timecapsule_no")
    private Timecapsule timecapsule;

    private String imagePath;

    private String owner;

    private Date createTime;

}
