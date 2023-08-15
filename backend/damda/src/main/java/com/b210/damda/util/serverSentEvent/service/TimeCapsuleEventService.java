package com.b210.damda.util.serverSentEvent.service;

import com.b210.damda.domain.dto.Timecapsule.TimecapsuleInviteUserDTO;
import com.b210.damda.domain.dto.serverSentEvent.timecapsule.CheckMyExpiredTimecapsuleDTO;
import com.b210.damda.domain.dto.serverSentEvent.timecapsule.TimeCapsuleSSEDTO;
import com.b210.damda.domain.dto.serverSentEvent.friend.UserNameAndImageDTO;
import com.b210.damda.domain.entity.Timecapsule.Timecapsule;
import com.b210.damda.domain.timecapsule.repository.TimeCapsuleSEERepository;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 타임캡슐 이벤트와 관련된 서비스입니다.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class TimeCapsuleEventService {
    private final EventStreamService eventStreamService; //실제 스트림을 보내는 객체
    private final AddOnEventService addOnEventService;   //공통 로직에서 사용되는 이벤트 메서드
    private final TimeCapsuleSEERepository timeCapsuleSEERepository;

    public void TimecapsuleEventRequest(TimecapsuleInviteUserDTO timecapsuleInviteUserDTO) {
        log.warn("타임캡슐 초대 이벤트");

        Long fromNo = timecapsuleInviteUserDTO.getFriendNo();
        Long userNo = addOnEventService.getUserNo();
        Long timeCapsuleNo = timecapsuleInviteUserDTO.getTimecapsuleNo();;

        String context = "님으로부터 타임캡슐 초대가 도착했어요, 초대 코드 : ";
        String eventName = "timecapsule-event";
        String inviteCode = timeCapsuleSEERepository.getInviteCode(timeCapsuleNo);

        //fromNo를 통해 해당 유저의 이름과 이미지를 받아온다.
        UserNameAndImageDTO fromInfo = timeCapsuleSEERepository.getUserNameAndImage(userNo);

        ServerSentEvent<JsonNode> event = addOnEventService.buildServerSentEvent(eventName, new TimeCapsuleSSEDTO(userNo, fromInfo.getUserName(), fromInfo.getUserProfileImage(), context, inviteCode, addOnEventService.getNowTime(LocalDateTime.now().plusHours(9))));
        eventStreamService.sendEvent(fromNo, event);
    }
    
    public void TimecapsuleEventAccept(String inviteCode) {
        log.warn("타임캡슐 승낙 이벤트");

        Long fromNo = timeCapsuleSEERepository.getUserNoByInviteCode(inviteCode); //inviteCode를 통해 방장 찾아옴
        Long userNo = addOnEventService.getUserNo();

        String context = "님이 타임캡슐에 참여했어요!";
        String eventName = "timecapsule-event";

        //fromNo를 통해 해당 유저의 이름과 이미지를 받아온다.
        UserNameAndImageDTO fromInfo = timeCapsuleSEERepository.getUserNameAndImage(userNo);

        ServerSentEvent<JsonNode> event = addOnEventService.buildServerSentEvent(eventName, new TimeCapsuleSSEDTO(userNo, fromInfo.getUserName(), fromInfo.getUserProfileImage(), context, inviteCode, addOnEventService.getNowTime(LocalDateTime.now().plusHours(9))));
        eventStreamService.sendEvent(fromNo, event);
    }


    public void checkAllTimeCapsuleService() {
        log.info("[login-after]내가 개봉할 수 있는 타임캡슐 확인");
        long userNo = addOnEventService.getUserNo();
        // 서버 시스템 시간 가져오기, 임시로 -7일해서 만료 시간 체크하였음.
        LocalDateTime serverTime = LocalDateTime.now().plusHours(9).minusDays(7);
        List<Timecapsule> getExpiredList = timeCapsuleSEERepository.getExpiredTimecapsuleByUserNoAndNowTimeStamp(userNo, Timestamp.valueOf(serverTime));

        String context = "개봉할 수 있는 타임캡슐이 있어요! : ";
        String eventName = "timecapsule-event";
        for (Timecapsule t : getExpiredList) {
            log.warn("[timecapsule] 타임캡슐 조회, 번호 : {}", t.getTimecapsuleNo());
            ServerSentEvent<JsonNode> event =
                    addOnEventService.buildServerSentEvent(eventName, new CheckMyExpiredTimecapsuleDTO(context, t.getType() ,t.getTitle(), addOnEventService.getNowTime(t.getOpenDate().toLocalDateTime())));
            eventStreamService.sendEvent(userNo, event);
        }
    }
}
