package com.b210.damda.domain.entity.Timecapsule;

import com.b210.damda.domain.dto.Timecapsule.TimecapsulePenaltyDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
@Getter
public class TimecapsulePenalty {

    @Id  @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long timecapsulePenaltyNo;

    private Boolean penalty;

    private String penaltyDescription;

    public TimecapsulePenalty() {
    }

    @Builder
    public TimecapsulePenalty(Boolean penalty, String penaltyDescription){
        this.penalty = penalty;
        this.penaltyDescription = penaltyDescription;
    }

    public TimecapsulePenaltyDTO toTimecapsulePenaltyDTO(){
        return TimecapsulePenaltyDTO.builder()
                .penaltyNo(this.timecapsulePenaltyNo)
                .penalty(this.penalty)
                .penaltyDescription(this.penaltyDescription)
                .build();
    }
}
