package com.b210.damda.util.weatherAPI.controller;

import com.b210.damda.domain.dto.weather.WeatherLocationDTO;
import com.b210.damda.util.weatherAPI.service.WeatherAPIService;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/weather")
@RequiredArgsConstructor
@Slf4j
public class WeatherAPIController {

    private final WeatherAPIService weatherAPIService;

    //좌표로 현재 날씨 찾기, FE에서 BE로 요청하는 엔드포인트
    @GetMapping("/now/weather")
    public String getNowWeatherInfos(@RequestParam("lan") double lan, @RequestParam("lat") double lat) throws Exception {
        WeatherLocationDTO weatherLocationDTO = new WeatherLocationDTO();
        weatherLocationDTO.setLan(lan);
        weatherLocationDTO.setLat(lat);

        //ResponseEntity<JsonNode> result = weatherAPIService.getNowWeatherInfos(weatherLocationDTO);
        return weatherAPIService.getNowWeatherInfos(weatherLocationDTO);
    }


}
