package com.b210.damda.domain.timecapsule.controller;

import com.b210.damda.domain.dto.Timecapsule.*;
import com.b210.damda.domain.dto.serverSentEvent.timecapsule.TimeCapsuleEventEnum;
import com.b210.damda.domain.dto.weather.WeatherLocationDTO;
import com.b210.damda.domain.file.service.S3UploadService;
import com.b210.damda.domain.timecapsule.service.TimecapsuleService;
import com.b210.damda.util.exception.CommonException;
import com.b210.damda.util.response.CommonResponse;
import com.b210.damda.util.response.DataResponse;
import com.b210.damda.util.serverSentEvent.service.TimeCapsuleEventService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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
    private final TimeCapsuleEventService timeCapsuleEventService;

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

    // 타임캡슐 초대 목록 가져오기
    @GetMapping("invite")
    public DataResponse<List<TimecapsuleInviteListDTO>> timecapsuleInviteList(@RequestParam("timecapsuleNo") Long timecapsuleNo){
        try{
            List<TimecapsuleInviteListDTO> timecapsuleInviteList = timecapsuleService.getTimecapsuleInviteList(timecapsuleNo);

            DataResponse<List<TimecapsuleInviteListDTO>> response = new DataResponse<>(200, "조회 성공");
            response.setData(timecapsuleInviteList);

            return response;
        }catch (CommonException e){
            return new DataResponse<>(e.getCustomExceptionStatus().getCode(), e.getCustomExceptionStatus().getMessage());
        }catch(Exception e){
            return new DataResponse<>(500,"알 수 없는 에러가 발생하였습니다. 잠시 후 다시 시도해주세요.");
        }
    }

    // 타임캡슐 초대하기
    @PatchMapping("invite")
    public DataResponse<Map<String, Object>> timecapsuleInviteUser(@RequestBody TimecapsuleInviteUserDTO timecapsuleInviteUserDTO){
        try{
            timecapsuleService.timecapsuleInviteUser(timecapsuleInviteUserDTO);
            timeCapsuleEventService.TimecapsuleEventService(timecapsuleInviteUserDTO, TimeCapsuleEventEnum.REQUEST);
            DataResponse<Map<String, Object>> response = new DataResponse<>(200, "타임캡슐 초대 성공");
            return response;
        }catch (CommonException e){
            return new DataResponse<>(e.getCustomExceptionStatus().getCode(), e.getCustomExceptionStatus().getMessage());
        }catch(Exception e){
            return new DataResponse<>(500,"알 수 없는 에러가 발생하였습니다. 잠시 후 다시 시도해주세요.");
        }
    }

    // 타임캡슐 초대 수락
    @PatchMapping("invite-accept")
    public DataResponse<Map<String, Object>> timecapsuleInviteAccept(@RequestBody TimecapsuleInviteAcceptDTO timecapsuleInviteAcceptDTO){
        try{
            timecapsuleService.timecapsuleInviteAccept(timecapsuleInviteAcceptDTO);

            return new DataResponse<>(200, "타임캡슐에 참여 성공하였습니다.");
        }catch (CommonException e){
            return new DataResponse<>(e.getCustomExceptionStatus().getCode(), e.getCustomExceptionStatus().getMessage());
        }catch(Exception e){
            return new DataResponse<>(500,"알 수 없는 에러가 발생하였습니다. 잠시 후 다시 시도해주세요.");
        }
    }

    // 타임캡슐 초대 거절
    @PatchMapping("invite-reject")
    public DataResponse<Map<String, Object>> timecapsuleInviteReject(@RequestBody TimecapsuleInviteAcceptDTO timecapsuleInviteAcceptDTO){
        try{
            timecapsuleService.timecapsuleInviteReject(timecapsuleInviteAcceptDTO);

            return new DataResponse<>(200, "거절 완료");
        }catch (CommonException e){
            return new DataResponse<>(e.getCustomExceptionStatus().getCode(), e.getCustomExceptionStatus().getMessage());
        }catch(Exception e){
            return new DataResponse<>(500,"알 수 없는 에러가 발생하였습니다. 잠시 후 다시 시도해주세요.");
        }
    }

    /*
        타임캡슐 스티커 받기
     */
    @GetMapping("deco/list")
    public DataResponse<Map<String,Object>> timecapsuleCardList(){

        List<MyItemListDTO> decoList = timecapsuleService.getMyDecoList();

        Map<String, Object> result = new HashMap<>();
        result.put("decoList", decoList);

        DataResponse<Map<String, Object>> response = new DataResponse<>(200, "스티커 조회 성공");
        response.setData(result);

        return response;
    }


    /*
        타임캡슐 카드 저장
     */
    @PostMapping("regist/card")
    public CommonResponse registCard( @RequestPart("timecapsuleNo") Long timecapsuleNo,
                                      @RequestParam("cardImage") MultipartFile cardImage){
        //log.info(cardImage.toString());
        timecapsuleService.registCard(cardImage, timecapsuleNo);
        CommonResponse response = new CommonResponse(200, "카드 저장 완료");
        return  response;
    }

    /*
        타임캡슐 나가기
     */
    @PatchMapping("exit")
    public CommonResponse timecapsuleExit(@RequestBody Map<String, Object> data){
        Long timecapsuleNo = Long.parseLong((String) data.get("timecapsuleNo"));
        timecapsuleService.timecapsuleExit(timecapsuleNo);
        CommonResponse response = new CommonResponse(200, "타임캡슐을 나갔습니다");
        return response;
    }

    /*
        타임캡슐 강퇴하기
     */
    @PatchMapping("kick")
    public CommonResponse timecapsuleKick(@RequestBody Map<String, Object> data){

        Long kickUserNo = Long.parseLong((String) data.get("kickUserNo"));
        Long timecapsuleNo = Long.parseLong((String) data.get("timecapsuleNo"));

        timecapsuleService.timecapsuleKick(timecapsuleNo, kickUserNo);

        CommonResponse response = new CommonResponse(200, "타임캡슐 강퇴 성공");
        return response;

    }

    /*
        타임캡슐 삭제하기
     */
    @PatchMapping("delete")
    public CommonResponse timecapsuleDelete(@RequestBody Map<String, Object> data){
        Long timecapsuleNo = Long.parseLong((String) data.get("timecapsuleNo"));
        timecapsuleService.timecapsuleDelete(timecapsuleNo);

        CommonResponse response = new CommonResponse(200, "타임캡슐 제거 성공");
        return response;
    }
    /*
        파일 사이즈 받기
     */
    @GetMapping("size")
    public DataResponse<Map<String, Object>> timecapsuleFileSize(@RequestParam("timecapsuleNo") Long timecapsuleNo){

        Map<String, Object> result = timecapsuleService.timecapsuleFileSize(timecapsuleNo);

        DataResponse<Map<String, Object>> response = new DataResponse<>(200, "파일 사이즈 조회 성공");
        response.setData(result);

        return response;
    }

    /*
        파일 첨부파일 받기
     */
    @PostMapping("regist/file")
    public DataResponse<Map<String, Object>> timecapsuleFileUpload(@RequestPart("fileContent") MultipartFile file,
                                                                   @RequestParam("timeCapsuleNo") Long timecapsuleNo){

        Map<String, Object>  result = timecapsuleService.timecapsuleFileUpload(file, timecapsuleNo);

        DataResponse<Map<String, Object>> response = new DataResponse<>(200, "파일 저장 성공");
        //response.setData(result);
        return response;
    }


    /*
        타임캡슐 SimpleInfo 반환
     */
    @GetMapping("simpleinfo")
    public DataResponse<Map<String, Object>> timecapsuleSimpleInfo(@RequestParam("timecapsuleNo") Long timecapsuleNo){

        TimecapsuleSimpleDTO simpleInfo = timecapsuleService.timecapsuleSimpleInfo(timecapsuleNo);

        Map<String, Object> result = new HashMap<>();
        result.put("timecapsuleSimpleInfo", simpleInfo);

        DataResponse<Map<String, Object>> response = new DataResponse<>(200, "타임캡슐 간단정보 조회 성공");
        response.setData(result);
        return response;

    }

    /*
        타임캡슐 작성된 카드 목록 반환
     */
    @GetMapping("cardlist")
    public DataResponse<Map<String, Object>> timecapsuleCardList(@RequestParam("timecapsuleNo") Long timecapsuleNo){

        List<TimecapsuleOpenCardDTO> cardList = timecapsuleService.timecapsuleCardList(timecapsuleNo);

        Map<String, Object> result = new HashMap<>();
        result.put("cardList", cardList);

        DataResponse<Map<String, Object>> response = new DataResponse<>(200, "카드 리스트 조회 성공");
        response.setData(result);
        return response;
    }

    /*
        타임캡슐 오픈 디테일
     */
    @GetMapping("open/detail")
    public DataResponse<Map<String, Object>> timecapsuleOpenDetail(@RequestParam("timecapsuleNo") Long timecapsuleNo){

        TimecapsuleOpenDetailDTO openDetail = timecapsuleService.timecapsuleOpenDetail(timecapsuleNo);

        Map<String,Object> result = new HashMap<>();
        result.put("timecapsuleOpenDetail", openDetail);

        DataResponse<Map<String, Object>> response = new DataResponse<>(200, "오픈 디테일 조회 성공");
        response.setData(result);
        return response;
    }

    /*
       오픈 랭킹
     */
    @GetMapping("open/rank")
    public DataResponse<Map<String, Object>> timecpasuleOpenRank(@RequestParam("timecapsuleNo") Long timecapsuleNo){

        Map<String, Object> openRank = timecapsuleService.timecapsuleOpenRank(timecapsuleNo);

        DataResponse<Map<String, Object>> response = new DataResponse<>(200, "오픈 디테일 조회 성공");
        response.setData(openRank);
        return response;
    }





}


