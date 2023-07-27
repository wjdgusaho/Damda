package com.b210.damda.domain.shop.repository;

import com.b210.damda.domain.entity.Thema;
import org.springframework.data.domain.Example;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ThemaRepository extends JpaRepository<Thema, Long> {

}
