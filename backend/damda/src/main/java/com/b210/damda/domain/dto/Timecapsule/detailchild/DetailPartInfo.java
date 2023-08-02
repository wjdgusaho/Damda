package com.b210.damda.domain.dto.Timecapsule.detailchild;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Setter @Getter
@Builder
public class DetailPartInfo {

    private Long userNo;
    private String nickname;
    private String profileImage;

}
