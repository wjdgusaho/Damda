package com.b210.damda.domain.dto;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.sql.Timestamp;

@Data
@Builder
@Getter @Setter
public class MainTimecapsuleListDTO {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long timecapsuleNo;
    private String type;
    private Timestamp sDate;
    private Timestamp eDate;
    private String name;
    private int capsuleIconNo;
    private int curCard;
    private int goalCard;
    private boolean state;

}
