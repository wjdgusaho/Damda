package com.b210.damda.domain.shop.repository;

import com.b210.damda.domain.entity.ThemeMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ThemeMappingRepository extends JpaRepository<ThemeMapping, Long> {

    List<ThemeMapping> findByUserUserNo(Long userNo);

    Optional<ThemeMapping> findByUserUserNoAndThemeThemeNo(Long userNo, Long themeNo);
}
