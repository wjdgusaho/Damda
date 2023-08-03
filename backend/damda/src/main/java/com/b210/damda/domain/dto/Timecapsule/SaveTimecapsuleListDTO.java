package com.b210.damda.domain.dto.Timecapsule;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.sql.Timestamp;

@Data
@Builder
@Getter @Setter
public class SaveTimecapsuleListDTO {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long timecapsuleNo;
    private String type;
    private String title;
    private Timestamp startDate;
    private Timestamp endDate;
    private int capsuleIconNo;
    private int goalCard;

}