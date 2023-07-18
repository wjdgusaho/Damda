package com.b210.damda.util.weatherAPI.service;

import com.b210.damda.domain.dto.WeatherDTO;
import org.springframework.web.bind.annotation.RequestBody;
import reactor.core.publisher.Mono;

import java.util.List;

public interface WeatherAPIService {
    Mono<String> getNowWeatherInfos(double lat, double lan) throws Exception;
}
