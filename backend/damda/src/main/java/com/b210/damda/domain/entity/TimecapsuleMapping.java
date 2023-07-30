package com.b210.damda.domain.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
public class TimecapsuleMapping {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long timecapsuleMappingNo;

    @ManyToOne
    @JoinColumn(name = "timecapsule_no")
    private Timecapsule timecapsule;

    @ManyToOne
    @JoinColumn(name = "user_no")
    private User user;

    private boolean isSave;

    private boolean isHost;

    private String deleteDate;

}
