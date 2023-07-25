package com.b210.damda.util.emailAPI.repository;

import com.b210.damda.domain.entity.EmailSendLog;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmailSendLogRepository extends JpaRepository<EmailSendLog, Long> {

//    @Query(value = "SELECT e.verificationCode FROM EmailSendLog e WHERE e.user.userNo = ?1 ORDER BY e.createTime DESC")
//    Optional<String> findTopVerificationCodeByUserNoOrderByCreateTimeDesc(Long userNo);

    Optional<EmailSendLog> findTopByUserUserNoOrderByCreateTimeDesc(Long userNo);

}
