package com.b210.damda.domain.dto.Timecapsule;

import com.b210.damda.domain.entity.Timecapsule.TimecapsuleCriteria;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Data
@Getter @Setter
@Builder
public class TimecapsuleCriteriaDTO {

    private Long criteriaId;

    private String criteriaType;

    private String weatherStatus;

    private Integer startTime;

    private Integer endTime;

    private String localBig;

    private String localMedium;

    private String timeKr;


    public TimecapsuleCriteria toEntity(){
        return TimecapsuleCriteria.builder()
                .type(this.criteriaType)
                .weatherStatus(this.weatherStatus)
                .startTime(this.startTime)
                .endTime(this.endTime)
                .localBig(this.localBig)
                .localMedium(this.localMedium)
                .timeKr(this.timeKr)
                .build();
    }

}
