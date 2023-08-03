package com.b210.damda.util.weatherAPI.controller;

import com.b210.damda.domain.dto.weather.WeatherLocationDTO;
import com.b210.damda.domain.dto.weather.WeatherLocationNameDTO;
import com.b210.damda.util.weatherAPI.service.WeatherLocationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/location")
@RequiredArgsConstructor
@Slf4j
public class LocationController {

    private final WeatherLocationService weatherLocationService;


    //좌표로 현재 지역 찾기
    @PostMapping("/now")
    public WeatherLocationNameDTO getNowLocation(@RequestBody WeatherLocationDTO weatherDTO) throws Exception {
        return weatherLocationService.getNowLocation(weatherDTO);
    }

    //1차 지명 얻기
    @GetMapping("/big")
    public List<String> getBigLocations() throws Exception {
        //서울특별시, 충청남도, .. 등 1차 지명 얻기
        return weatherLocationService.getBigLocations();
    }
    //1차 지명 입력값으로 2차 지명 얻기
    @PostMapping("/medium")
    public List<String> getMediumLocations(@RequestBody String bigLocation) throws Exception {
        return weatherLocationService.getMediumLocations(bigLocation);
    }

    //1차, 2차 값으로 해당 지역 좌표 얻어오기
    @PostMapping("/get-by-name")
    public WeatherLocationDTO getCoordinateByName(@RequestBody WeatherLocationNameDTO weatherLocationNameDTO) throws Exception {
        return weatherLocationService.getCoordinateByName(weatherLocationNameDTO);
    }
}
