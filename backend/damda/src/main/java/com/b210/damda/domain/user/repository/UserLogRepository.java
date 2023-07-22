package com.b210.damda.domain.user.repository;

import com.b210.damda.domain.entity.UserLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserLogRepository extends JpaRepository<UserLog, Long> {
}
