package com.b210.damda.domain.friend.repository;

import com.b210.damda.domain.entity.User;
import com.b210.damda.domain.entity.userFriend;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FriendRepository extends JpaRepository<userFriend, Long> {

    Optional<userFriend> getUserFriendByUser(User user);
}
