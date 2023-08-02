package com.b210.damda.util.weatherAPI.repository;


import com.b210.damda.domain.entity.WeatherLocationList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface WeatherLocationListRepository extends JpaRepository<WeatherLocationList, Long> {
    List<WeatherLocationList> findAllByLocalBig(String localBig);
}
