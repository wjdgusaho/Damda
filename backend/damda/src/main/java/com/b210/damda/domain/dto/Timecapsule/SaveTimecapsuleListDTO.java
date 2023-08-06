package com.b210.damda.domain.dto.Timecapsule;

import lombok.*;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.sql.Timestamp;

@Data
@Builder
@Getter @Setter
@AllArgsConstructor
public class SaveTimecapsuleListDTO {

    private Long timecapsuleNo;
    private String type;
    private String title;
    private Timestamp startDate;
    private Timestamp endDate;
    private int capsuleIconNo;
    private int goalCard;

    public SaveTimecapsuleListDTO(){

    }
}
