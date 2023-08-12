package com.b210.damda.domain.friend.repository;

import com.b210.damda.domain.dto.serverSentEvent.friend.GetRequestToMeDTO;
import com.b210.damda.domain.dto.serverSentEvent.friend.UserNameAndImageDTO;
import com.b210.damda.domain.entity.User.UserFriend;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FriendSSERepository extends JpaRepository<UserFriend, Long> {
    //해당 유저의 이름과 이미지 가져오기
    @Query("SELECT new com.b210.damda.domain.dto.serverSentEvent.friend.UserNameAndImageDTO(u.nickname, u.profileImage) From User u Where u.userNo = :userNo")
    UserNameAndImageDTO getUserNameAndImage(@Param("userNo") Long userNo);


    //해당 유저로 요청한 사람들의 정보 가져오기
    @Query("SELECT new com.b210.damda.domain.dto.serverSentEvent.friend.GetRequestToMeDTO(uf.user.nickname, uf.user.userNo, uf.requestDate, uf.user.profileImage) FROM UserFriend uf WHERE uf.friend.userNo = :friendNo and uf.status = 'REQUESTED'")
    List<GetRequestToMeDTO> getRequestToMe(@Param("friendNo") Long friendNo);
}
