package com.b210.damda.util.weatherAPI.repository;

import com.b210.damda.domain.entity.WeatherLocation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WeatherLocationRepository extends JpaRepository<WeatherLocation, Long> {

    List<WeatherLocation> findByNxAndNy(int nx, int ny);
}
