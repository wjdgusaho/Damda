package com.b210.damda.domain.timecapsule.repository;

import com.b210.damda.domain.entity.Timecapsule.UserLocation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserLocationRepository extends JpaRepository<UserLocation, Long> {

    UserLocation findByUserUserNo(Long userNo);

}
