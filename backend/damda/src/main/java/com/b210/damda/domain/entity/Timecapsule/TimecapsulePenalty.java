package com.b210.damda.domain.entity.Timecapsule;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
@Setter @Getter
@Builder
@AllArgsConstructor
public class TimecapsulePenalty {

    @Id  @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long timecapsulePenaltyNo;

    private Boolean penalty;

    private String penaltyDescription;

    public TimecapsulePenalty() {

    }
}
