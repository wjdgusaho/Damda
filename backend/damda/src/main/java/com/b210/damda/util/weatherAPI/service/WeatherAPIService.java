package com.b210.damda.util.weatherAPI.service;

import com.b210.damda.domain.dto.weather.WeatherLocationDTO;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public interface WeatherAPIService {
    ResponseEntity<JsonNode> getNowWeatherInfos(WeatherLocationDTO weatherDTO) throws Exception;
    ResponseEntity<JsonNode> convertWeatherDTO(Mono<String> response) throws Exception;
}
