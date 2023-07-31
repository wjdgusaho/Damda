package com.b210.damda.domain.entity;

import com.b210.damda.domain.dto.SaveCapsuleCriteriaDTO;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;

@Entity
@Setter  @Getter
public class TimecapsuleCriteria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long criteria_id;

    @OneToOne
    @JoinColumn(name = "timecapsule_no")
    private Timecapsule timecapsule;

    private String type;

    private String weatherStatus;

    private Date card_input_start;

    private Date card_input_end;

    private int nx;

    private int ny;

    private String location;

    public SaveCapsuleCriteriaDTO toSaveCapsuleCriteriaDTO(){
        return SaveCapsuleCriteriaDTO.builder()
                .type(this.type)
                .weatherStatus(this.weatherStatus)
                .location(this.location)
                .build();
    }
}
