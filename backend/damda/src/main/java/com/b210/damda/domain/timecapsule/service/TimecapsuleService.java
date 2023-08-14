package com.b210.damda.domain.timecapsule.service;

import com.b210.damda.domain.dto.Timecapsule.*;
import com.b210.damda.domain.dto.weather.WeatherLocationDTO;
import com.b210.damda.domain.entity.Timecapsule.TimecapsuleMapping;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public interface TimecapsuleService {
    List<MainTimecapsuleListDTO> workTimecapsule(WeatherLocationDTO weatherLocationDto);

    List<SaveTimecapsuleListDTO> saveTimecapsule();

    Long createTimecapsule(TimecapsuleCreateDTO timecapsuleCreateDTO);

    TimecapsuleDetailDTO getTimecapsuleDetail(Long timecapsuleNo);

    List<MyItemListDTO> getMyDecoList();

    void registCard(MultipartFile cardImage, Long timecapsuleNo);

    TimecapsuleDetailDTO joinTimecalsule(String inviteCode);

    List<TimecapsuleInviteListDTO> getTimecapsuleInviteList(Long timecapsuleNo);

    void timecapsuleExit(Long timecapsuleNo);

    void timecapsuleKick(Long timecapsuleNo, Long kickUserNo);

    void timecapsuleDelete(Long timecapsuleNo);

    void timecapsuleInviteUser(TimecapsuleInviteUserDTO timecapsuleInviteUserDTO);

    void timecapsuleInviteAccept(TimecapsuleInviteAcceptDTO timecapsuleInviteAcceptDTO);

    void timecapsuleInviteReject(TimecapsuleInviteAcceptDTO timecapsuleInviteAcceptDTO);

    Map<String, Object> timecapsuleFileSize(Long timecapsuleNo);

    Map<String, Object> timecapsuleFileUpload(MultipartFile file, Long timecapsuleNo);

    TimecapsuleSimpleDTO timecapsuleSimpleInfo(Long timecapsuleNo);

    List<TimecapsuleOpenCardDTO> timecapsuleCardList(Long timecapsuleNo);

    TimecapsuleOpenDetailDTO timecapsuleOpenDetail(Long timecapsuleNo);

    Map<String, Object> timecapsuleOpenRank(Long timecapsuleNo);

    void timecapsuleOpenSave(Long timecapsuleNo);
}
