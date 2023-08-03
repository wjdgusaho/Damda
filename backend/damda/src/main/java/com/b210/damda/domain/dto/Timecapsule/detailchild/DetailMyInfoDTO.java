package com.b210.damda.domain.dto.Timecapsule.detailchild;

import lombok.*;

@Data
@Getter @Setter
@Builder
@AllArgsConstructor
public class DetailMyInfoDTO {

    private Long userNo;
    private boolean cardAble;
    private boolean fileAble;
    private boolean isHost;

    public DetailMyInfoDTO(){
    }
}
