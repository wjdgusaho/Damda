package com.b210.damda.domain.dto.Timecapsule;


import lombok.*;

@Data
@Builder
@Getter @Setter
@AllArgsConstructor
public class TimecapsuleShopDTO {

    private long timecapsuleNo;
    private String title;
    private long maxFileSize;
    private long nowFileSize;
    private int capsuleIconNo;

    public TimecapsuleShopDTO(){
    }
}
