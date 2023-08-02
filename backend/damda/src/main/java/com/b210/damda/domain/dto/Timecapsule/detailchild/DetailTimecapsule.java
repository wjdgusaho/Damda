package com.b210.damda.domain.dto.Timecapsule.detailchild;

import com.b210.damda.domain.dto.Timecapsule.TimecapsulePenaltyDTO;
import com.b210.damda.domain.entity.Timecapsule.TimecapsulePenalty;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

@Data
@Getter @Setter
@Builder
public class DetailTimecapsule {

    private Long timecapsuleNo;
    private Timestamp registDate;
    private Timestamp openDate;
    private String title;
    private String description;
    private String capsuleIcon;
    private String capsuletype;
    private Integer goalCard;
    private Integer nowCard;
    //벌칙
    private TimecapsulePenaltyDTO penalty;

}
