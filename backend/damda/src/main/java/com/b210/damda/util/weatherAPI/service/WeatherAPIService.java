package com.b210.damda.util.weatherAPI.service;

import com.b210.damda.domain.dto.weather.WeatherLocationDTO;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public interface WeatherAPIService {
    Mono<String> getNowWeatherInfos(WeatherLocationDTO weatherDTO) throws Exception;
}
