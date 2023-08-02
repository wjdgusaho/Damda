package com.b210.damda.domain.dto.Timecapsule;

import com.b210.damda.domain.entity.Timecapsule.TimecapsulePenalty;
import lombok.*;

@Data
@Getter @Setter
@Builder
@AllArgsConstructor
public class TimecapsulePenaltyDTO {

    private Long timecapsulePenaltyNo;

    private Boolean penalty;

    private String penaltyDescription;

    public TimecapsulePenalty toEntity(){
        return TimecapsulePenalty.builder()
                .penalty(this.penalty == null ? false : this.penalty)
                .penaltyDescription(this.penaltyDescription)
                .build();
    }

    public TimecapsulePenaltyDTO() {
        this.penalty = false;
        this.penaltyDescription = null;
    }

}
