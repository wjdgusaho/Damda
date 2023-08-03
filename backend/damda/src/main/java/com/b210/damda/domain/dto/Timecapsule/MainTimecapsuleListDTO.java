package com.b210.damda.domain.dto.Timecapsule;

import lombok.*;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.sql.Timestamp;

@Data
@Builder
@Getter @Setter
@AllArgsConstructor
public class MainTimecapsuleListDTO {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long timecapsuleNo;
    private String type;
    private String sDate;
    private String eDate;
    //private String sTime;
    //private String eTime;
    private String name;
    private int capsuleIconNo;
    private int curCard;
    private int goalCard;
    private boolean state;

    public MainTimecapsuleListDTO(){

    }
}
