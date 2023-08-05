package com.b210.damda.domain.user.repository;

import com.b210.damda.domain.entity.User.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByUserPw(String userPw);

    @Query("SELECT u FROM User u WHERE u.nickname = :nickname AND u.userNo != :userNo AND u.deleteDate = null") // 나는 빼고 검색
    List<User> findByNicknameContainingAndUserNoNot(@Param("nickname") String nickname, @Param("userNo") Long userNo);

    User findByUserNoAndDeleteDateIsNull(Long userNo);

    Optional<User> findByUserNo(Long userNo);
}
