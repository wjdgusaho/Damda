package com.b210.damda.domain.dto.serverSentEvent;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class ServerSentEventDTO {
    private String fromUser;
    private String fromNickName;
    private String fromProfileImage;
    private String content;
    private String date;

}
