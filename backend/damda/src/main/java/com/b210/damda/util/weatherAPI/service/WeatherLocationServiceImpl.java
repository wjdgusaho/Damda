package com.b210.damda.util.weatherAPI.service;

import com.b210.damda.domain.dto.WeatherDTO;
import com.b210.damda.domain.entity.WeatherLocation;
import com.b210.damda.util.weatherAPI.repository.WeatherLocationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class WeatherLocationServiceImpl implements WeatherLocationService {

    private final WeatherLocationRepository weatherLocationRepository;
    @Override
    public WeatherDTO getNowLocation(WeatherDTO weatherDTO) throws Exception {
        // WeatherDTO에서 lan과 lat 값을 가져옴
        double lan = weatherDTO.getLan();
        double lat = weatherDTO.getLat();
        int nx = weatherDTO.getNx();
        int ny = weatherDTO.getNy();

        List<WeatherLocation> weatherLocations = weatherLocationRepository.findByNxAndNy(nx, ny);
        for (int i = 0; i < weatherLocations.size(); i++) {
            log.info("{}, {}", weatherLocations.get(i).getLocalMedium(), weatherLocations.get(i).getLocalSmall());
        }
        return new WeatherDTO();
    }
}
