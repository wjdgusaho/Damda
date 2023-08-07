package com.b210.damda.domain.dto.Timecapsule;

import com.fasterxml.jackson.annotation.JsonProperty;
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

    private Long timecapsuleNo;
    private String type;
    @JsonProperty("sDate")
    private String sDate;
    @JsonProperty("eDate")
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
