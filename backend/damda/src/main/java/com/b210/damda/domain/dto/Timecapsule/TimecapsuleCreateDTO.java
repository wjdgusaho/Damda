package com.b210.damda.domain.dto.Timecapsule;

import com.b210.damda.domain.entity.Timecapsule.Timecapsule;
import com.b210.damda.domain.entity.Timecapsule.TimecapsuleCriteria;
import com.b210.damda.domain.entity.Timecapsule.TimecapsulePenalty;
import lombok.*;

import java.sql.Timestamp;
import java.util.List;

@Data
@Getter @Setter
@Builder
@AllArgsConstructor
public class TimecapsuleCreateDTO {

    private String title;

    private String type;

    private String description;

    private int goalCard;

    private Timestamp openDate;

    private TimecapsulePenaltyDTO penalty;

    private TimecapsuleCriteriaDTO criteria;

    private List<String> cardInputDay;

    public TimecapsuleCreateDTO(){
        
    }

    public Timecapsule toEntity(){
        Timecapsule timecapsule = Timecapsule.builder()
                .title(this.title)
                .type(this.type)
                .openDate(this.openDate != null ? this.openDate : null)
                .description(this.description)
                .goalCard(this.type.equals("GOAL") ? this.goalCard : 0)
                .build();


        TimecapsuleCriteria timecapsuleCriteriaEntity = this.criteria.toEntity();
        timecapsule.addTimecapsuleCriteria(timecapsuleCriteriaEntity);

       TimecapsulePenalty timecapsulePenaltyEntity = null;
        if(this.penalty != null) {
            timecapsulePenaltyEntity = this.penalty.toEntity();
        }
        else{
            TimecapsulePenaltyDTO timecapsulePenaltyDTO = new TimecapsulePenaltyDTO();
            timecapsulePenaltyEntity = timecapsulePenaltyDTO.toEntity();
        }
        timecapsule.addTimecapsulePenalty(timecapsulePenaltyEntity);


        return timecapsule;
    }
}


