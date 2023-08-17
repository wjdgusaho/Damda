package com.b210.damda.domain.dto.Timecapsule;

import lombok.*;

@Data
@Getter @Setter
@Builder
@AllArgsConstructor
public class TimecapsuleOpenCardDTO {

    private Long timecapsuleCardNo;
    private Long userNo;
    private String imagePath;

    public TimecapsuleOpenCardDTO(){
    }
}
