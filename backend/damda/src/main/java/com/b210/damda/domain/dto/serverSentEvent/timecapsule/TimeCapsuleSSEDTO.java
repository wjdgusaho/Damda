package com.b210.damda.domain.dto.serverSentEvent.timecapsule;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class TimeCapsuleSSEDTO {
    private Long fromUser;
    private String fromName;
    private String fromProfileImage;
    private String content;
    private String code;
    private String date;
    private Long timecapsuleNo;

}
