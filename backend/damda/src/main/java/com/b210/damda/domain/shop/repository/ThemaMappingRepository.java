package com.b210.damda.domain.shop.repository;

import com.b210.damda.domain.entity.ThemaMapping;
import com.b210.damda.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ThemaMappingRepository extends JpaRepository<ThemaMapping, Long> {

    List<ThemaMapping> findByUserNo(Long userNo);

}
