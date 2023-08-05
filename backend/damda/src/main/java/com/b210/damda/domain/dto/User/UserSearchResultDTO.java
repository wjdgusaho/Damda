package com.b210.damda.domain.dto.User;

import com.b210.damda.domain.entity.User.User;
import com.b210.damda.domain.entity.User.UserFriend;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class UserSearchResultDTO {

    private Long userNo;
    private String nickname;
    private String profileImage;
    private String status;

    public UserSearchResultDTO() {
    }

    public UserSearchResultDTO(User user, UserFriend friend) {
        this.userNo = user.getUserNo();
        this.nickname = user.getNickname();
        this.profileImage = user.getProfileImage();
        this.status = friend.getStatus();
    }

    public void createSearchResultDTO(User user) {
        this.userNo = user.getUserNo();
        this.nickname = user.getNickname();
        this.profileImage = user.getProfileImage();
        this.status = "";
    }
}
