package com.b210.damda.util.emailAPI.repository;

import com.b210.damda.domain.entity.EmailSendLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmailSendLogRepository extends JpaRepository<EmailSendLog, Long> {
}
