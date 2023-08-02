package com.b210.damda.domain.dto.Timecapsule.detailchild;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter @Setter
@Builder
public class DetailMyInfoDTO {

    private Long userNo;
    private boolean cardAble;
    private boolean fileAble;
    private boolean isHost;

}
