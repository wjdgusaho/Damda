package com.b210.damda.util.weatherAPI.service;

import com.b210.damda.domain.dto.WeatherDTO;
import reactor.core.publisher.Mono;

public interface WeatherAPIService {
    Mono<String> getNowWeatherInfos(WeatherDTO weatherDTO) throws Exception;
}
