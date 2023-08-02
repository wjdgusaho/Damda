package com.b210.damda.domain.dto.Friend;

import com.b210.damda.domain.entity.User.User;
import com.b210.damda.domain.entity.User.UserFriend;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class FriendListDTO {

    private Long id;
    private String nickname;
    private String profileImage;
    private boolean isFavorite;

    public FriendListDTO() {
    }

    public FriendListDTO(UserFriend userFriend, User friend) {
        this.id = friend.getUserNo();
        this.nickname = friend.getNickname();
        this.profileImage = friend.getProfileImage();
        this.isFavorite = userFriend.isFavorite();
    }
}
