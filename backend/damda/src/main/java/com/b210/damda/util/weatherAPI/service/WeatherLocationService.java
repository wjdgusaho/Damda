package com.b210.damda.util.weatherAPI.service;

import com.b210.damda.domain.dto.weather.WeatherLocationDTO;
import com.b210.damda.domain.dto.weather.WeatherLocationNameDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface WeatherLocationService {
    WeatherLocationNameDTO getNowLocation(WeatherLocationDTO weatherDTO) throws Exception;

    List<String> getBigLocations() throws Exception;
    List<String> getMediumLocations(String bigLocation) throws Exception;
    WeatherLocationDTO getCoordinateByName(WeatherLocationNameDTO weatherLocationNameDTO) throws Exception;
}
