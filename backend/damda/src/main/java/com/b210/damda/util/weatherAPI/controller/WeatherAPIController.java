package com.b210.damda.util.weatherAPI.controller;

import com.b210.damda.domain.dto.WeatherDTO;
import com.b210.damda.domain.dto.WeatherLocationDTO;
import com.b210.damda.util.weatherAPI.service.WeatherAPIService;
import com.b210.damda.util.weatherAPI.service.WeatherLocationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;


@CrossOrigin("*")
@RestController
@RequestMapping("/api/weather")
@RequiredArgsConstructor
@Slf4j
public class WeatherAPIController {

    private final WeatherAPIService weatherAPIService;
    private final WeatherLocationService weatherLocationService;
    @PostMapping("/now/weather")
    public Mono<String> getNowWeatherInfos(@RequestBody WeatherDTO weatherDTO) throws Exception {
        return weatherAPIService.getNowWeatherInfos(weatherDTO);
    }

    @PostMapping("/now/location")
    public WeatherLocationDTO getNowLocation(@RequestBody WeatherDTO weatherDTO) throws Exception {
        return weatherLocationService.getNowLocation(weatherDTO);
    }

    @GetMapping("/location/big")
    public List<String> getBigLocations() throws Exception {
        //서울특별시, 충청남도, .. 등 1차 지명 얻기
        return weatherLocationService.getBigLocations();
    }
    @GetMapping("/location/medium")
    public List<String> getMediumLocations(@RequestBody String bigLocation) throws Exception {
        return weatherLocationService.getMediumLocations(bigLocation);
    }

}
