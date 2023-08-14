package com.b210.damda.domain.dto.serverSentEvent;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@Data
public class ServerSentEventDTO {
    private Long fromUser;
    private String fromName;
    private String fromProfileImage;
    private String content;
    private String date;
}
