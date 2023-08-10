package com.b210.damda.domain.shop.repository;

import com.b210.damda.domain.entity.User.User;
import com.b210.damda.domain.entity.theme.ThemeMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ThemeMappingRepository extends JpaRepository<ThemeMapping, Long> {

    List<ThemeMapping> findByUserUserNo(Long userNo);

    Optional<ThemeMapping> findByUserUserNoAndThemeThemeNo(Long userNo, Long themeNo);

    @Query("SELECT tm FROM ThemeMapping tm WHERE tm.user = :user AND tm.theme.themeNo = :themeNo")
    ThemeMapping findByUserAndThemeNo(@Param("user")User user, @Param("themeNo") Long themeNo);
}
