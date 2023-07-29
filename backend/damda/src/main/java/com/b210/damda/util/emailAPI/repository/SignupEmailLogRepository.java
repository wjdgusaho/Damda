package com.b210.damda.util.emailAPI.repository;

import com.b210.damda.domain.entity.SignupEmailLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SignupEmailLogRepository extends JpaRepository<SignupEmailLog, Long> {
}
