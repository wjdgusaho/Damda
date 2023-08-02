package com.b210.damda.domain.timecapsule.repository;

import com.b210.damda.domain.entity.Timecapsule.TimecapsuleMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TimecapsuleMappingRepository extends JpaRepository<TimecapsuleMapping, Long> {

    List<TimecapsuleMapping> findByUserUserNo(Long userNo);

    Optional<TimecapsuleMapping> findByUserUserNoAndTimecapsuleTimecapsuleNo(Long userNo, Long timecapsuleNo);

    @Query("SELECT tm FROM TimecapsuleMapping tm " +
            "WHERE tm.timecapsule.timecapsuleNo = :timecapsuleNo " +
            "AND ((tm.isSave = true) OR (tm.isSave = false AND tm.deleteDate IS NULL))")
    List<TimecapsuleMapping> findNotSavedButDeleted(Long timecapsuleNo);

}
