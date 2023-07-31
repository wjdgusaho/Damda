package com.b210.damda.domain.dto;

import com.b210.damda.domain.entity.Timecapsule;
import com.b210.damda.domain.entity.TimecapsuleCriteria;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Data
@Getter @Setter
@Builder
public class TimecapsuleCreateDTO {

    private String title;

    private String type;

    private String description;

    private int goalCard;

    private boolean penalty;

    private TimecapsulePenaltyDTO timecapsulePenalty;

    private TimecapsuleCriteriaDTO criteria;

    private List<String> cardInputDay;


    public Timecapsule toEntity(){
        Timecapsule timecapsule = Timecapsule.builder()
                .title(this.title)
                .type(this.type)
                .description(this.description)
                .goalCard(this.type.equals("GOAL") ? this.goalCard : 0)
                .penalty(this.type.equals("GOAL") ? this.penalty : false)
                .build();

        if (this.criteria != null) {
            TimecapsuleCriteria timecapsuleCriteriaEntity = this.criteria.toEntity();
            timecapsule.setTimecapsuleCriteria(timecapsuleCriteriaEntity);
        }

        return timecapsule;
    }
}


