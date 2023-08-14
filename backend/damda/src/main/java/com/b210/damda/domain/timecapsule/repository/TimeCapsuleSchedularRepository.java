package com.b210.damda.domain.timecapsule.repository;

import com.b210.damda.domain.entity.Timecapsule.Timecapsule;
import com.b210.damda.domain.entity.Timecapsule.TimecapsuleMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TimeCapsuleSchedularRepository extends JpaRepository<TimecapsuleMapping, Long> {
    @Transactional
    @Modifying
    @Query("UPDATE TimecapsuleMapping tc SET tc.cardAble = :cardAble, tc.fileAble = :fileAble where tc.timecapsule IN (SELECT t.timecapsuleNo FROM Timecapsule t WHERE t.type != 'CLASSIC')")
    void cardAble(@Param("cardAble") boolean cardAble, @Param("fileAble") boolean fileAble);

    @Query("SELECT t FROM Timecapsule t WHERE t.openDate > :serverTime")
    List<Timecapsule> getExpiredTimeCapsule(@Param("serverTime") Timestamp serverTime);

    @Query("SELECT FROM WHERE")
    List<Long> getUserNoBy();

}
