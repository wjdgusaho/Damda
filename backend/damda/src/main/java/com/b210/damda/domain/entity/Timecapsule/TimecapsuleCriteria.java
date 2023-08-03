package com.b210.damda.domain.entity.Timecapsule;

import com.b210.damda.domain.dto.Timecapsule.TimecapsuleCriteriaDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;

@Entity
@Setter  @Getter
@Builder
@AllArgsConstructor
public class TimecapsuleCriteria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long criteriaId;

    private String type;

    private String weatherStatus;

    private Integer startTime;

    private Integer endTime;

    private String localBig;

    private String localMedium;

    private String timeKr;

    public TimecapsuleCriteria() {

    }

    public TimecapsuleCriteriaDTO toTimecapsuleCriteriaDTO(){
        return TimecapsuleCriteriaDTO.builder()
                .criteriaId(this.criteriaId)
                .criteriaType(this.type)
                .weatherStatus(this.weatherStatus)
                .startTime(this.startTime)
                .endTime(this.endTime)
                .localBig(this.localBig)
                .localMedium(this.localMedium)
                .timeKr(this.timeKr)
                .build();
    }
}
