package com.b210.damda.domain.dto.Timecapsule;

import com.b210.damda.domain.dto.Timecapsule.detailchild.DetailMyInfoDTO;
import com.b210.damda.domain.dto.Timecapsule.detailchild.DetailPartInfoDTO;
import lombok.*;

import java.sql.Timestamp;
import java.util.List;

@Data
@Getter @Setter
@Builder
@AllArgsConstructor
public class TimecapsuleDetailDTO {

    private Long timecapsuleNo;
    private String capsuleType;
    private Timestamp registDate;
    private Timestamp openDate;
    private String title;
    private String description;
    private String capsuleIcon;
    private Integer goalCard;
    private Long nowCard;
    //벌칙
    private TimecapsulePenaltyDTO penalty;
    //조건
    private TimecapsuleCriteriaDTO criteriaInfo;
    //해당타임캡슐의 나의 정보
    private DetailMyInfoDTO myInfo;
    //참가자 목록
    private List<DetailPartInfoDTO> partInfo;

    public TimecapsuleDetailDTO(){

    }
}
