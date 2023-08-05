package com.b210.damda.domain.timecapsule.controller;

import com.b210.damda.domain.dto.Timecapsule.*;
import com.b210.damda.domain.dto.weather.WeatherLocationDTO;
import com.b210.damda.domain.timecapsule.service.TimecapsuleService;
import com.b210.damda.util.exception.CommonException;
import com.b210.damda.util.response.DataResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/timecapsule")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin("*")
public class TimecapsuleController {

    private final TimecapsuleService timecapsuleService;

    /*
        진행중인 타임캡슐 리스트 (메인 및 보관함)
     */
    @PostMapping("view")
    public DataResponse<Map<String, Object>> workTimecapsuleList(@RequestBody WeatherLocationDTO weatherLocationDto) {
        List<MainTimecapsuleListDTO> workTimecapsuleList = timecapsuleService.workTimecapsule(weatherLocationDto);
        Map<String, Object> result = new HashMap<>();
        result.put("timecapsuleList", workTimecapsuleList);

        DataResponse<Map<String, Object>> response = new DataResponse<>(200, "진행중 : 타임캡슐 리스트 조회 성공");
        response.setData(result);

        return response;
    }

    /*
        보관함 타임캡슐 리스트 (보관함)
     */
    @GetMapping("store/list")
    public DataResponse<Map<String, Object>> saveTimecapsulelist(){
        List<SaveTimecapsuleListDTO> saveTimecapsulelist = timecapsuleService.saveTimecapsule();
        Map<String, Object> result = new HashMap<>();
        result.put("timecapsuleList", saveTimecapsulelist);

        DataResponse<Map<String, Object>> response = new DataResponse<>(200, "보관함 : 타임캡슐 리스트 조회 성공");
        response.setData(result);

        return response;
    }

    /*
        타임캡슐 생성
     */
    @PostMapping("create")
    public DataResponse<Map<String, Object>> createTimecapsule(@RequestBody TimecapsuleCreateDTO timecapsuleCreateDTO){
        log.info(timecapsuleCreateDTO.toString());
        Long timecapsuleNo = timecapsuleService.createTimecapsule(timecapsuleCreateDTO);

        Map<String, Object> result = new HashMap<>();
        result.put("timecapsuleNo", timecapsuleNo);

        DataResponse<Map<String, Object>> response = new DataResponse<>(200, "타임캡슐 생성 완료");
        response.setData(result);

        return response;
    }


    /*
        타임캡슐 상세페이지
     */
    @GetMapping("detail")
    public DataResponse<Map<String, Object>> timecapsuleDetail(@RequestParam  Map<String, Object> data){

        Long timecapsuleNo = Long.parseLong((String) data.get("timecapsuleNo"));

        TimecapsuleDetailDTO timecapsule = timecapsuleService.getTimecapsuleDetail(timecapsuleNo);

        Map<String, Object> result = new HashMap<>();
        result.put("timecapsule", timecapsule);

        DataResponse<Map<String, Object>> response = new DataResponse<>(200, "타임캡슐 상세정보 조회 성공");
        response.setData(result);

        return response;
    }

    // 타임캡슐 초대번호 입력
    @PostMapping("join")
    public DataResponse<Map<String, Object>> timecapsuleJoin(@RequestBody TimecapsuleJoinDTO timecapsuleJoinDTO){
        try{
            TimecapsuleDetailDTO timecapsule = timecapsuleService.joinTimecalsule(timecapsuleJoinDTO.getInviteCode());

            Map<String, Object> result = new HashMap<>();
            result.put("timecapsule", timecapsule);

            DataResponse<Map<String, Object>> response = new DataResponse<>(200, "타임캡슐 참여 성공");
            response.setData(result);

            return response;
        }catch (CommonException e){
            return new DataResponse<>(e.getCustomExceptionStatus().getCode(), e.getCustomExceptionStatus().getMessage());
        }catch(Exception e){
            return new DataResponse<>(500,"알 수 없는 에러가 발생하였습니다. 잠시 후 다시 시도해주세요.");
        }
    }

}


