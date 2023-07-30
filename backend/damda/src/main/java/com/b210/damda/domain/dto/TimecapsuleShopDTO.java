package com.b210.damda.domain.dto;


import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Builder
@Getter @Setter
public class TimecapsuleShopDTO {

    private long timecapsuleNo;
    private String title;
    private long maxFileSize;
    private long nowFileSize;
    private int capsuleIconNo;

}
