package com.b210.damda.domain.timecapsule.controller;

import com.b210.damda.domain.dto.Timecapsule.*;
import com.b210.damda.domain.timecapsule.service.TimecapsuleService;
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
    @GetMapping("view")
    public DataResponse<Map<String, Object>> workTimecapsuleList(){

        List<MainTimecapsuleListDTO> workTimecapsuleList = timecapsuleService.workTimecapsule();
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
        TimecapsuleDTO timacapsule = timecapsuleService.createTimecapsule(timecapsuleCreateDTO);

        DataResponse<Map<String, Object>> response = new DataResponse<>(200, "타임캡슐 생성 완료");
        return response;
    }


    @PostMapping("detail")
    public DataResponse<TimecapsuleDetailDTO> timecapsuleDetail(@RequestBody  Map<String, Object> data){

        Long timecapsuleNo = Long.parseLong((String) data.get("timecapsuleNo"));

        TimecapsuleDetailDTO timecapsule = timecapsuleService.getTimecapsuleDetail(timecapsuleNo);

        DataResponse<TimecapsuleDetailDTO> response = new DataResponse<>(200, "타임캡슐 상세정보 조회 성공");
        response.setData(timecapsule);
        return response;
        
    }

}


