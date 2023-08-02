package com.b210.damda.domain.timecapsule.repository;

import com.b210.damda.domain.entity.Timecapsule.TimecapsuleCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TimecapsuleCardRepository extends JpaRepository<TimecapsuleCard , Long> {

    List<TimecapsuleCard> findByTimecapsuleTimecapsuleNo(Long timecapsuleNo);

}
