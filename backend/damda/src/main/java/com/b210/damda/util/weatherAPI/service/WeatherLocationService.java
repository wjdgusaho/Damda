package com.b210.damda.util.weatherAPI.service;

import com.b210.damda.domain.dto.WeatherDTO;
import com.b210.damda.domain.dto.WeatherLocationDTO;
import org.springframework.stereotype.Service;

@Service
public interface WeatherLocationService {
    WeatherLocationDTO getNowLocation(WeatherDTO weatherDTO) throws Exception;
}
