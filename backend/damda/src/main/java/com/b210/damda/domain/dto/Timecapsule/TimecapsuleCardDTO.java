package com.b210.damda.domain.dto.Timecapsule;


import com.b210.damda.domain.entity.Timecapsule.TimecapsuleCard;
import lombok.*;

import java.sql.Timestamp;

@Data
@Getter @Setter
@Builder
@AllArgsConstructor
public class TimecapsuleCardDTO {

    private Long timecapsuleCardNo;

    private Long timecapsuleNo;

    private Long userNo;

    private String imagePath;

    private Timestamp createTime;

    public TimecapsuleCardDTO(){
    }

}
