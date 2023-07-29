package com.b210.damda.util.emailAPI.repository;

import com.b210.damda.domain.entity.SignupEmailLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SignupEmailLogRepository extends JpaRepository<SignupEmailLog, Long> {

    Optional<SignupEmailLog> findTopByEmailOrderByCreateTimeDesc(String email);
}
