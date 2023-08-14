package com.b210.damda.domain.shop.repository;

import com.b210.damda.domain.entity.Items.Items;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ItemsRepository extends JpaRepository<Items, Long> {

    Optional<Items> findByItemNo(Long itemNo);

}
