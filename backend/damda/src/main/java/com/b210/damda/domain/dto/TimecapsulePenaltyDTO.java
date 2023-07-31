package com.b210.damda.domain.dto;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter @Setter
@Builder
public class TimecapsulePenaltyDTO {

    private Long timecapsulePenaltyNo;

    private String penaltyDescription;

    private int penaltyCount;


}
