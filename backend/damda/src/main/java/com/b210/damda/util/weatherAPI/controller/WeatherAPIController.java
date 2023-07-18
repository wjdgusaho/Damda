package com.b210.damda.util.weatherAPI.controller;

import com.b210.damda.domain.dto.WeatherDTO;
import com.b210.damda.util.weatherAPI.service.WeatherAPIService;
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
    @GetMapping("/")
    public Mono<String> getNowWeatherInfos() throws Exception {
        return weatherAPIService.getNowWeatherInfos(37.309894444444, 127.644311111111);
    }
}
