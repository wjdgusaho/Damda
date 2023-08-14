package com.b210.damda.domain.timecapsule.repository;

import com.b210.damda.domain.entity.Timecapsule.Timecapsule;
import com.b210.damda.domain.entity.Timecapsule.TimecapsuleFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TimecapsuleFileRepository extends JpaRepository<TimecapsuleFile, Long> {

    List<TimecapsuleFile> getByTimecapsule(Timecapsule timecapsule);

}
