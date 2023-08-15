package com.b210.damda.domain.user.repository;

import com.b210.damda.domain.entity.User.UserCoinUseLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserCoinUseLogRepository extends JpaRepository<UserCoinUseLog, Long> {
}
