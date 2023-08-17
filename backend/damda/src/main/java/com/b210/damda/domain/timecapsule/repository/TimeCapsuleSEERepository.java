package com.b210.damda.domain.timecapsule.repository;

import com.b210.damda.domain.dto.serverSentEvent.friend.UserNameAndImageDTO;
import com.b210.damda.domain.entity.Timecapsule.Timecapsule;
import com.b210.damda.domain.entity.User.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;

@Repository
public interface TimeCapsuleSEERepository extends JpaRepository<Timecapsule, Long> {
    //해당 유저의 이름과 이미지 가져오기
    @Query("SELECT new com.b210.damda.domain.dto.serverSentEvent.friend.UserNameAndImageDTO(u.nickname, u.profileImage) From User u Where u.userNo = :userNo")
    UserNameAndImageDTO getUserNameAndImage(@Param("userNo") Long userNo);

    @Query("SELECT t.inviteCode FROM Timecapsule t WHERE t.timecapsuleNo = :timecapsuleNo")
    String getInviteCode(@Param("timecapsuleNo") Long timeCapsuleNo);

    //timeCapsuleno를 통해 방장의 정보를 찾아오고 이름과 no를 찾아오기
    @Query("SELECT u.userNo " +
            "From User u, Timecapsule t " +
            "Where u.userNo = (SELECT tm.user.userNo FROM TimecapsuleMapping tm WHERE tm.timecapsule.timecapsuleNo = :timecapsuleNo AND tm.isHost = true )")
    Long getUserNoByTimeCapsuleNo(@Param("timecapsuleNo") Long timecapsuleNo);

    @Query("SELECT tm.user.userNo, tm.timecapsule.timecapsuleNo FROM TimecapsuleMapping tm WHERE tm.timecapsule.timecapsuleNo = (SELECT t.timecapsuleNo FROM Timecapsule t WHERE t.inviteCode =:inviteCode AND tm.isHost = true)")
    List<Long> getUserNoByInviteCode(@Param("inviteCode") String inviteCode);

    //userNo를 통해 개봉할 수 있는 타임캡슐을 찾고, 현재 개봉 가능한 캡슐을 알림
    @Query("SELECT t FROM Timecapsule t WHERE t.timecapsuleNo IN (SELECT tm.timecapsule.timecapsuleNo FROM TimecapsuleMapping tm WHERE tm.user.userNo = :userNo) AND t.openDate <= :serverTime ")
    List<Timecapsule> getExpiredTimecapsuleByUserNoAndNowTimeStamp(@Param("userNo") Long userNo,@Param("serverTime") Timestamp serverTime);

    //해당 캡슐이 저장소에 보관되어있는지를 확인
    @Query("SELECT CASE WHEN COUNT(tm) > 0 THEN true ELSE false END " +
            "FROM TimecapsuleMapping tm " +
            "WHERE tm.timecapsule.timecapsuleNo = :timecapsuleNo " +
            "AND tm.user.userNo = :userNo " +
            "AND tm.isSave = false")
    boolean checkTimecapsuleIsNotOpened(@Param("timecapsuleNo") Long timecapsuleNo, @Param("userNo") Long userNo);

}
