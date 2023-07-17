package com.b210.damda.util.weatherAPI.service;

import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

public interface WeatherAPIService {
    List<Float> getWeatherInfos(@RequestBody List<Float> data) throws Exception;
}
