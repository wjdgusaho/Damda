package com.b210.damda.domain.timecapsule.service;

import com.b210.damda.domain.dto.Timecapsule.*;
import com.b210.damda.domain.dto.weather.WeatherLocationDTO;
import com.b210.damda.domain.dto.weather.WeatherLocationNameDTO;
import com.b210.damda.domain.entity.Timecapsule.TimecapsuleMapping;

import java.util.List;
import java.util.Map;

public interface TimecapsuleService {

    Map<String,List<TimecapsuleMapping>>  getTimecapsuleList(Long userNo);
    List<MainTimecapsuleListDTO> workTimecapsule(WeatherLocationDTO weatherLocationDto);

    List<SaveTimecapsuleListDTO> saveTimecapsule();

    Long createTimecapsule(TimecapsuleCreateDTO timecapsuleCreateDTO);

    TimecapsuleDetailDTO getTimecapsuleDetail(Long timecapsuleNo);
}
