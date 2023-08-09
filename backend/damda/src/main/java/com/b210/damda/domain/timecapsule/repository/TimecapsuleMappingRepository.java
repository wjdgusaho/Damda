package com.b210.damda.domain.timecapsule.repository;

import com.b210.damda.domain.entity.Timecapsule.Timecapsule;
import com.b210.damda.domain.entity.Timecapsule.TimecapsuleMapping;
import com.b210.damda.domain.entity.User.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TimecapsuleMappingRepository extends JpaRepository<TimecapsuleMapping, Long> {

    List<TimecapsuleMapping> findByUserUserNo(Long userNo);

    @Query("SELECT tm FROM TimecapsuleMapping tm WHERE tm.user.userNo = :userNo AND tm.timecapsule.timecapsuleNo = :timecapsuleNo")
    TimecapsuleMapping findByUserUserNoOne(@Param("timecapsuleNo") Long timecapsuleNo, @Param("userNo") Long userNo);

    @Query("SELECT tm FROM TimecapsuleMapping tm WHERE tm.timecapsule.timecapsuleNo = :timecapsuleNo")
    List<TimecapsuleMapping> findByIdNo(@Param("timecapsuleNo") Long TimecapsuleNo);

    @Query("SELECT tm FROM TimecapsuleMapping tm " +
            "WHERE tm.timecapsule.timecapsuleNo = :timecapsuleNo " +
            "AND tm.user.userNo = :userNo " +
            "AND ((tm.isSave = true) OR (tm.isSave = false AND tm.deleteDate IS NULL))")
    Optional<TimecapsuleMapping> findByUserUserNoAndTimecapsuleTimecapsuleNo(@Param("userNo") Long userNo, @Param("timecapsuleNo")Long timecapsuleNo);

    @Query("SELECT tm FROM TimecapsuleMapping tm " +
            "WHERE tm.timecapsule.timecapsuleNo = :timecapsuleNo " +
            "AND ((tm.isSave = true) OR (tm.isSave = false AND tm.deleteDate IS NULL))")
    List<TimecapsuleMapping> findNotSavedButDeleted(@Param("timecapsuleNo") Long timecapsuleNo);

    Optional<TimecapsuleMapping> findByUserAndTimecapsule(User user, Timecapsule timecapsule);

    // 유저의 타임캡슐 확인(용량 늘리기)
    @Query("SELECT tm FROM TimecapsuleMapping tm WHERE tm.user = :user AND tm.deleteDate = null")
    List<TimecapsuleMapping> findByUserAndDeleteNot(User user);

}
