package com.b210.damda.util.weatherAPI.service;

import com.b210.damda.domain.dto.weather.WeatherDTO;
import com.b210.damda.domain.dto.weather.WeatherLocationDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface WeatherLocationService {
    WeatherLocationDTO getNowLocation(WeatherDTO weatherDTO) throws Exception;

    List<String> getBigLocations() throws Exception;
    List<String> getMediumLocations(String bigLocation) throws Exception;
}
