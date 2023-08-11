package com.b210.damda.domain.dto.Timecapsule;

import lombok.*;

@Data
@Builder
@Getter @Setter
@AllArgsConstructor
public class TimecapsuleSimpleDTO {

    private Long timecapsuleNo;
    private String title;
    private String type;
    private String capsuleIconNo;
    private boolean isAlone;


    public TimecapsuleSimpleDTO(){
    }
}
