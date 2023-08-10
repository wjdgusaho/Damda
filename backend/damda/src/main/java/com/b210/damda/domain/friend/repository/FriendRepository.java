package com.b210.damda.domain.friend.repository;

import com.b210.damda.domain.dto.serverSentEvent.friend.UserNameAndImageDTO;
import com.b210.damda.domain.entity.User.User;
import com.b210.damda.domain.entity.User.UserFriend;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FriendRepository extends JpaRepository<UserFriend, Long> {

//    // 친구 추가 요청(유저)
//    @Query("SELECT uf FROM UserFriend uf WHERE uf.user = :user AND uf.friend = :friend AND uf.friend.deleteDate != null")
//    UserFriend getUserFriendByUserAndFriendAndDeleteDate(@Param("user") User user, @Param("friend") User friend);
//
//    // 친구 추가 요청(친구)
//    @Query("SELECT uf FROM UserFriend uf WHERE uf.user = :friend AND uf.friend = :user AND uf.friend.deleteDate != null")
//    UserFriend getUserFriendByFriendAndUserAndDeleteDate(@Param("user") User user, @Param("friend") User friend);

    // 나와 친구의 번호로 친구목록 찾기
    @Query("SELECT u FROM UserFriend u WHERE u.user = :user AND u.friend.deleteDate = null  AND u.friend.userNo = :userNo")
    UserFriend getUserFriendByUserANDFriendNo(@Param("user") User user, @Param("userNo") Long userNo);

    @Query("SELECT u FROM UserFriend u WHERE u.user = :user AND u.friend.deleteDate = null")
    List<UserFriend> getUserFriendByUser(@Param("user") User user);


    // 유저와 친구의 정보로 친구목록 찾기
    @Query("SELECT u FROM UserFriend u WHERE u.user = :user AND u.friend = :friend")
    UserFriend getUserFriendByUserAndFriend(@Param("user") User user, @Param("friend") User friend);

    @Query("SELECT u FROM UserFriend u WHERE u.user = :user AND u.status = :status")
    List<UserFriend> findUserFriendByUserFriend(@Param("user") User friend, @Param("status") String status);

    // 타임캡슐 친구 목록 가져오기(탈퇴하지 않고, 친구인 사람만)
    @Query("SELECT u FROM UserFriend u WHERE u.user = :user AND u.status = :status AND u.friend.deleteDate = null")
    List<UserFriend> findUserFriendByUser(@Param("user") User user, @Param("status") String status);

    //나에게 요청한 모든 유저의 pk 가져오기
    @Query("SELECT u.user.userNo FROM UserFriend u WHERE u.friend.userNo = :friendNo AND u.status = :status")
    List<Long> findUserNoByFriendNoAndStatus(@Param("friendNo") Long friendNo, @Param("status") String status);

    //해당 유저의 이름과 이미지 가져오기
    @Query("SELECT u.nickname, u.profileImage From User u Where u.userNo = :userNo")
    UserNameAndImageDTO getUserNameAndImage(Long userNo);

    //해당 유저로 요청한 사람들의 정보 가져오기
//    @Query("SELECT u.friend, u.profileImage From UserFriend u Where u.userNo = :userNo")
//    List<UserFriend> getRequestToMe(Long friendNo);

}
