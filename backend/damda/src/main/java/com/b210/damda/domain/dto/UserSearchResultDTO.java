package com.b210.damda.domain.dto;

import com.b210.damda.domain.entity.User;
import com.b210.damda.domain.entity.UserFriend;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class UserSearchResultDTO {

    private Long id;
    private String nickname;
    private String profileImage;
    private String status;

    public UserSearchResultDTO() {
    }

    public UserSearchResultDTO(User user, UserFriend friend) {
        this.id = user.getUserNo();
        this.nickname = user.getNickname();
        this.profileImage = user.getProfileImage();
        this.status = friend.getStatus();
    }
}
