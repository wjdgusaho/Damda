package com.b210.damda.util.weatherAPI.controller;

import com.b210.damda.domain.dto.weather.WeatherLocationDTO;
import com.b210.damda.util.weatherAPI.service.WeatherAPIService;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/weather")
@RequiredArgsConstructor
@Slf4j
public class WeatherAPIController {

    private final WeatherAPIService weatherAPIService;

    //좌표로 현재 날씨 찾기
    @PostMapping("/now/weather")
    public JsonNode getNowWeatherInfos(@RequestBody WeatherLocationDTO weatherLocationDTO) throws Exception {
        JsonNode result = weatherAPIService.getNowWeatherInfos(weatherLocationDTO);
        return result;
    }


}
