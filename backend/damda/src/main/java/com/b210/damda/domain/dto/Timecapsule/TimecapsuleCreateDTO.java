package com.b210.damda.domain.dto.Timecapsule;

import com.b210.damda.domain.entity.Timecapsule.Timecapsule;
import com.b210.damda.domain.entity.Timecapsule.TimecapsuleCriteria;
import com.b210.damda.domain.entity.Timecapsule.TimecapsulePenalty;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;
import java.util.List;

@Data
@Getter @Setter
@Builder
public class TimecapsuleCreateDTO {

    private String title;

    private String type;

    private String description;

    private int goalCard;

    private Timestamp openDate;

    private TimecapsulePenaltyDTO penalty;

    private TimecapsuleCriteriaDTO criteria;

    private List<String> cardInputDay;


    public Timecapsule toEntity(){
        Timecapsule timecapsule = Timecapsule.builder()
                .title(this.title)
                .type(this.type)
                .openDate(this.openDate != null ? this.openDate : null)
                .description(this.description)
                .goalCard(this.type.equals("GOAL") ? this.goalCard : 0)
                .build();


        TimecapsuleCriteria timecapsuleCriteriaEntity = this.criteria.toEntity();
        timecapsule.setTimecapsuleCriteria(timecapsuleCriteriaEntity);

       TimecapsulePenalty timecapsulePenaltyEntity = null;
        if(this.penalty != null) {
            timecapsulePenaltyEntity = this.penalty.toEntity();
        }
        else{
            TimecapsulePenaltyDTO timecapsulePenaltyDTO = new TimecapsulePenaltyDTO();
            timecapsulePenaltyEntity = timecapsulePenaltyDTO.toEntity();
        }
        timecapsule.setTimecapsulePenalty(timecapsulePenaltyEntity);


        return timecapsule;
    }
}


