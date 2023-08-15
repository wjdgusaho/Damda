package com.b210.damda.domain.timecapsule.repository;

import com.b210.damda.domain.entity.Timecapsule.Timecapsule;
import com.b210.damda.domain.entity.Timecapsule.TimecapsuleMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.Optional;

@Repository
public interface TimecapsuleRepository extends JpaRepository<Timecapsule, Long> {

    @Override
    Optional<Timecapsule> findById (Long timecapsuleNo);

    @Query("SELECT t FROM Timecapsule t WHERE t.inviteCode = :inviteCode AND t.removeDate = null")
    Timecapsule findByInviteCode(@Param("inviteCode") String inviteCode);



}
