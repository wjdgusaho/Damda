package com.b210.damda.domain.dto.serverSentEvent.friend;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@AllArgsConstructor
@Data
public class GetRequestToMeDTO {
    String fromName;
    Long fromNo;
    LocalDateTime date;
    String fromProfileImage;
}
