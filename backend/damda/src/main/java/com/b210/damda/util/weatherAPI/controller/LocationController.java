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
    @GetMapping("/now")
    public WeatherLocationNameDTO getNowLocation(@RequestParam double lan, @RequestParam double lat) throws Exception {
        WeatherLocationDTO weatherLocationDTO = new WeatherLocationDTO();
        weatherLocationDTO.setLan(lan);
        weatherLocationDTO.setLat(lat);
        return weatherLocationService.getNowLocation(weatherLocationDTO);
    }

    //1차 지명 얻기
    @GetMapping("/big")
    public List<String> getBigLocations() throws Exception {
        //서울특별시, 충청남도, .. 등 1차 지명 얻기
        return weatherLocationService.getBigLocations();
    }
    //1차 지명 입력값으로 2차 지명 얻기
    @GetMapping("/medium")
    public List<String> getMediumLocations(@RequestParam String bigLocation) throws Exception {
        return weatherLocationService.getMediumLocations(bigLocation);
    }

    //1차, 2차 값으로 해당 지역 좌표 얻어오기
    @GetMapping("/get-by-name")
    public WeatherLocationDTO getCoordinateByName(@RequestParam String localBig, @RequestParam String localMedium ) throws Exception {
        WeatherLocationNameDTO weatherLocationNameDTO = new WeatherLocationNameDTO();
        weatherLocationNameDTO.setLocalBig(localBig);
        weatherLocationNameDTO.setLocalMedium(localMedium);
        return weatherLocationService.getCoordinateByName(weatherLocationNameDTO);
    }
}
