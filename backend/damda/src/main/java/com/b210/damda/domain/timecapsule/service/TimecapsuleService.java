package com.b210.damda.domain.timecapsule.service;

import com.b210.damda.domain.dto.MainTimecapsuleListDTO;
import com.b210.damda.domain.dto.SaveTimecapsuleListDTO;
import com.b210.damda.domain.dto.TimecapsuleCreateDTO;
import com.b210.damda.domain.dto.TimecapsuleDTO;
import com.b210.damda.domain.entity.TimecapsuleMapping;

import java.util.List;
import java.util.Map;

public interface TimecapsuleService {

    Map<String,List<TimecapsuleMapping>>  getTimecapsuleList(Long userNo);
    List<MainTimecapsuleListDTO> workTimecapsule();

    List<SaveTimecapsuleListDTO> saveTimecapsule();

    TimecapsuleDTO createTimecapsule(TimecapsuleCreateDTO timecapsuleCreateDTO);
}
