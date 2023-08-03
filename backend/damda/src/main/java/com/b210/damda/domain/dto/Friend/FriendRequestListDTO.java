package com.b210.damda.domain.dto.Friend;

import com.b210.damda.domain.entity.User.User;
import com.b210.damda.domain.entity.User.UserFriend;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class FriendRequestListDTO {

    private Long userNo;
    private String nickname;
    private String profileImage;

    public FriendRequestListDTO() {
    }

    public FriendRequestListDTO(User friend) {
        this.userNo = friend.getUserNo();
        this.nickname = friend.getNickname();
        this.profileImage = friend.getProfileImage();
    }
}
