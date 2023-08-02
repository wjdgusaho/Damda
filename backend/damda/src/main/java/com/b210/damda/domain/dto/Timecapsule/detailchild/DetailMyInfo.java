package com.b210.damda.domain.dto.Timecapsule.detailchild;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter @Setter
@Builder
public class DetailMyInfo {

    private Long userNo;
    private Long cardAble;
    private Long fileAble;
    private boolean isHost;

}
