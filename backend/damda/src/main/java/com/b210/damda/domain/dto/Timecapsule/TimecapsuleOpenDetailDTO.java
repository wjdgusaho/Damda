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
public class TimecapsuleOpenDetailDTO {

    private Long timecapsuleNo;
    private String capsuleType;
    private Timestamp registDate;
    private Timestamp openDate;
    private String title;
    private String description;
    private Integer goalCard;
    private Long nowFileSize;
    //조건
    private TimecapsuleCriteriaDTO criteriaInfo;
    //참가자 목록
    private List<DetailPartInfoDTO> partInfo;
    //벌칙
    private TimecapsulePenaltyDTO penalty;

    public TimecapsuleOpenDetailDTO(){
    }
}
