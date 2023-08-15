package com.b210.damda.domain.user.repository;

import com.b210.damda.domain.entity.User.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    //Optional<User> findByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.email = :email AND u.accountType = 'ORIGIN' AND u.deleteDate IS NULL")
    Optional<User> findByOriginEmail(String email);


    @Query("SELECT u FROM User u WHERE u.email = :email AND u.accountType = 'KAKAO' AND u.deleteDate IS NULL")
    Optional<User> findByKakaoEmail(String email);

    Optional<User> findByUserPw(String userPw);

    @Query("SELECT u FROM User u WHERE u.nickname LIKE %:nickname% AND u.userNo != :userNo AND u.deleteDate = null") // 나는 빼고 검색
    List<User> findByNicknameContainingAndUserNoNot(@Param("nickname") String nickname, @Param("userNo") Long userNo);

    User findByUserNoAndDeleteDateIsNull(Long userNo);

    Optional<User> findByUserNo(Long userNo);

    @Transactional
    @Modifying
    @Query("UPDATE UserEvent ue SET ue.isCheck = 0")
    void updateIsCheck();
}
