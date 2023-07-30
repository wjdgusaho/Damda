package com.b210.damda.domain.shop.repository;

import com.b210.damda.domain.entity.Timecapsule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TimecapsuleRepository extends JpaRepository<Timecapsule, Long> {

    Optional<Timecapsule> findById (Long timecapsuleNo);
}
