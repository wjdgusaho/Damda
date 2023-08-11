package com.b210.damda.domain.dto.Timecapsule;

import lombok.*;

@Data
@Getter @Setter
@Builder
@AllArgsConstructor
public class TimecapsuleOpenRankDTO {

    private Long userNo;
    private String nickname;
    private String profileImage;
    private Integer cardCnt;

    public TimecapsuleOpenRankDTO(){}
}
