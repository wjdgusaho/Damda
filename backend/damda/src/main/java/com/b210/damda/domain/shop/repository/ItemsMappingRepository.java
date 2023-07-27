package com.b210.damda.domain.shop.repository;

import com.b210.damda.domain.entity.ItemsMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemsMappingRepository extends JpaRepository<ItemsMapping, Long> {
    List<ItemsMapping> findByUserUserNo(Long userNo);
}
