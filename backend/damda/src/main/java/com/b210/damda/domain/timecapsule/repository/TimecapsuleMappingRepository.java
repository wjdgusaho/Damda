package com.b210.damda.domain.timecapsule.repository;

import com.b210.damda.domain.entity.TimecapsuleMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TimecapsuleMappingRepository extends JpaRepository<TimecapsuleMapping, Long> {

    List<TimecapsuleMapping> findByUserUserNo(Long userNo);

    Optional<TimecapsuleMapping> findByUserUserNoAndTimecapsuleTimecapsuleNo(Long userNo, Long timecapsuleNo);
}
