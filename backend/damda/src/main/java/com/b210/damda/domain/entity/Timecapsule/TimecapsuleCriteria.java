package com.b210.damda.domain.entity.Timecapsule;

import com.b210.damda.domain.dto.Timecapsule.TimecapsuleCriteriaDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;

@Entity
@Getter
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

    @Builder
    public TimecapsuleCriteria(String type, String weatherStatus, Integer startTime,
                               Integer endTime, String localBig, String localMedium, String timeKr){
        this.type = type;
        this.weatherStatus = weatherStatus;
        this.startTime = startTime;
        this.endTime = endTime;
        this.localBig = localBig;
        this.localMedium = localMedium;
        this.timeKr = timeKr;
    }

    public TimecapsuleCriteriaDTO toTimecapsuleCriteriaDTO(){
        return TimecapsuleCriteriaDTO.builder()
                .criteriaId(this.criteriaId)
                .type(this.type)
                .weatherStatus(this.weatherStatus)
                .startTime(this.startTime)
                .endTime(this.endTime)
                .localBig(this.localBig)
                .localMedium(this.localMedium)
                .timeKr(this.timeKr)
                .build();
    }
}
