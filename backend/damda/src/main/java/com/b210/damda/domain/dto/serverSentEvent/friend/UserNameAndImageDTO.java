package com.b210.damda.domain.dto.serverSentEvent.friend;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;


@Getter
public class UserNameAndImageDTO {
    String userName;
    String userProfileImage;

    public UserNameAndImageDTO(String userName, String userProfileImage) {
        this.userName = userName;
        this.userProfileImage = userProfileImage;
    }
}
