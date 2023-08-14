package com.b210.damda.domain.shop.repository;

import com.b210.damda.domain.entity.Items.ItemsMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ItemsMappingRepository extends JpaRepository<ItemsMapping, Long> {
    List<ItemsMapping> findByUserUserNo(Long userNo);

    Optional<ItemsMapping> findByUserUserNoAndItemsItemNo(Long userNo, Long itemNo);
}
