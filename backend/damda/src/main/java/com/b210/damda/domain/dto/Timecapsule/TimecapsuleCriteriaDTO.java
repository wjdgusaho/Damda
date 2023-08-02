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

    private String type;

    private String weatherStatus;

    private Date cardInputStart;

    private Date cardInputEnd;

    private int nx;

    private int ny;

    private String location;



    public TimecapsuleCriteria toEntity(){
        return TimecapsuleCriteria.builder()
                .type(this.type)
                .weatherStatus(this.weatherStatus)
                .cardInputStart(this.cardInputStart)
                .cardInputEnd(this.cardInputEnd)
                .nx(this.nx)
                .ny(this.ny)
                .location(this.location)
                .build();
    }

}
