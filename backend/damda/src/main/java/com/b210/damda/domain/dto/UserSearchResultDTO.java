package com.b210.damda.domain.dto;

import com.b210.damda.domain.entity.User;
import com.b210.damda.domain.entity.userFriend;

public class UserSearchResultDTO {

    private Long id;
    private String nickname;
    private String profileImage;
    private boolean isFavorite;
    private String status;

    public UserSearchResultDTO(User user, userFriend friend) {
        this.id = user.getUserNo();
        this.nickname = user.getNickname();
        this.profileImage = user.getProfileImage();
        this.isFavorite = friend.isFavorite();
        this.status = friend.getStatus();
    }
}
