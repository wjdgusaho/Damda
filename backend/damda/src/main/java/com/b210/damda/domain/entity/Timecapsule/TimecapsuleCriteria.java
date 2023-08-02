package com.b210.damda.domain.entity.Timecapsule;

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
}
