package com.b210.damda.util.kakaoAPI.repository;

import com.b210.damda.domain.entity.User.KakaoLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KakaoLogRepository extends JpaRepository<KakaoLog, Long> {
    KakaoLog findByUserUserNo(Long userNo);
}
