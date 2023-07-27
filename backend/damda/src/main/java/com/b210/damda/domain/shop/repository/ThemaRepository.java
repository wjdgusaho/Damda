package com.b210.damda.domain.shop.repository;

import com.b210.damda.domain.entity.Thema;
import org.springframework.data.domain.Example;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ThemaRepository extends JpaRepository<Thema, Long> {

}
