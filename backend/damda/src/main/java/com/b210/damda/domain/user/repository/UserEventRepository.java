package com.b210.damda.domain.user.repository;

import com.b210.damda.domain.entity.User.User;
import com.b210.damda.domain.entity.User.UserEvent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserEventRepository extends JpaRepository<UserEvent, Long> {

    UserEvent findByUser(User user);
}
