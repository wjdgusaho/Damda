package com.b210.damda.domain.shop.repository;

import com.b210.damda.domain.entity.ThemaMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ThemaMappingRepository extends JpaRepository<ThemaMapping, Long> {

    List<ThemaMapping> findByUserUserNo(Long userNo);

    Optional<ThemaMapping> findByUserUserNoAndThemaThemaNo(Long userNo, Long themaNo);
}
