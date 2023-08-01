package com.b210.damda.util.weatherAPI.service;

import com.b210.damda.domain.dto.WeatherDTO;
import org.springframework.stereotype.Service;

@Service
public interface WeatherLocationService {
    WeatherDTO getNowLocation(WeatherDTO weatherDTO) throws Exception;
}
