package com.b210.damda.domain.shop.repository;

import com.b210.damda.domain.entity.ItemDetails;
import com.b210.damda.domain.entity.ItemsMapping;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ItemDetailsRepository extends JpaRepository<ItemDetails, Long> {

    List<ItemDetails> findByItemsItemNo(Long itemNo);
}
