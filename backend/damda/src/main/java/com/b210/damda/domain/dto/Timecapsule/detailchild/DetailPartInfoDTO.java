package com.b210.damda.domain.dto.Timecapsule.detailchild;

import lombok.*;

@Data
@Setter @Getter
@Builder
@AllArgsConstructor
public class DetailPartInfoDTO {

    private Long userNo;
    private String nickname;
    private String profileImage;

    public DetailPartInfoDTO(){
    }
}
