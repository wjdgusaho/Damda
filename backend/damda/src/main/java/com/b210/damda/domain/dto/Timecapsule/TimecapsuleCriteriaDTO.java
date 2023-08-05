package com.b210.damda.domain.dto.Timecapsule;

import com.b210.damda.domain.entity.Timecapsule.TimecapsuleCriteria;
import lombok.*;

import java.util.List;

@Data
@Getter @Setter
@Builder
@AllArgsConstructor
public class TimecapsuleCriteriaDTO {

    private Long criteriaId;

    private String type;

    private String weatherStatus;

    private Integer startTime;

    private Integer endTime;

    private String localBig;

    private String localMedium;

    private String timeKr;

    private List<CirteriaDayDTO> cirteriaDays;

    public TimecapsuleCriteriaDTO(){
    }


    public TimecapsuleCriteria toEntity(){
        return TimecapsuleCriteria.builder()
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
