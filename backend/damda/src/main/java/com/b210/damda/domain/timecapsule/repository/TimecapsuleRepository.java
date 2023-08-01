package com.b210.damda.domain.timecapsule.repository;

import com.b210.damda.domain.entity.Timecapsule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TimecapsuleRepository extends JpaRepository<Timecapsule, Long> {

    Optional<Timecapsule> findById (Long timecapsuleNo);
}
