package com.b210.damda.util.weatherAPI.controller;

import com.b210.damda.util.weatherAPI.service.WeatherAPIService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    public void test() throws Exception {
        List<Float> temp = new ArrayList<>();
        weatherAPIService.getWeatherInfos(temp);
    }
}
