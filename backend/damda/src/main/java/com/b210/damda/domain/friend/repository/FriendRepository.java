package com.b210.damda.domain.friend.repository;

import com.b210.damda.domain.entity.User;
import com.b210.damda.domain.entity.userFriend;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendRepository extends JpaRepository<userFriend, Long> {

    List<userFriend> getUserFriendByUser(User user);

    userFriend findByFriendNo(Long friendNo);
}
