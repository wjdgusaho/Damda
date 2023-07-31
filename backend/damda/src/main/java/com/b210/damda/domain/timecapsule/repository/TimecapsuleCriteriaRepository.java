package com.b210.damda.domain.timecapsule.repository;

import com.b210.damda.domain.entity.TimecapsuleCriteria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TimecapsuleCriteriaRepository extends JpaRepository<TimecapsuleCriteria, Long> {


}
