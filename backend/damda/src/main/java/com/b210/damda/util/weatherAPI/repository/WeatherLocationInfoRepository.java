package com.b210.damda.util.weatherAPI.repository;

import com.b210.damda.domain.entity.weather.WeatherLocationInfo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WeatherLocationInfoRepository extends JpaRepository<WeatherLocationInfo, Long> {

    List<WeatherLocationInfo> findByNxAndNy(int nx, int ny);
    WeatherLocationInfo findDistinctTopByLocalBigAndLocalMedium(String localBig, String localMedium);

}
