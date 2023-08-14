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

    Timecapsule findByInviteCode(String inviteCode);

    @Transactional
    @Modifying
    @Query("UPDATE TimecapsuleMapping tc SET tc.cardAble = :cardAble, tc.fileAble = :fileAble where tc.timecapsule IN (SELECT t.timecapsuleNo FROM Timecapsule t WHERE t.type != 'CLASSIC')")
    void cardAble(@Param("cardAble") boolean cardAble, @Param("fileAble") boolean fileAble);

}
