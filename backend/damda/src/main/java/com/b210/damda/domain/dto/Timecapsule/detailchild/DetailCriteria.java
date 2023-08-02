package com.b210.damda.domain.dto.Timecapsule.detailchild;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.security.Timestamp;
@Data
@Getter @Setter
@Builder
public class DetailCriteria {

    private String criteriaType;
    private Integer startTime;
    private Integer endTime;
    private String location;
    private String weatherStatus;
    private String timeKr;

}
