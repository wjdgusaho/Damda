package com.b210.damda.util.serverSentEvent.service;

import com.b210.damda.domain.dto.Timecapsule.TimecapsuleDTO;
import com.b210.damda.domain.dto.Timecapsule.TimecapsuleInviteUserDTO;
import com.b210.damda.domain.dto.serverSentEvent.ServerSentEventDTO;
import com.b210.damda.domain.dto.serverSentEvent.TimeCapsuleSSEDTO;
import com.b210.damda.domain.dto.serverSentEvent.friend.FriendEventEnum;
import com.b210.damda.domain.dto.serverSentEvent.friend.UserNameAndImageDTO;
import com.b210.damda.domain.dto.serverSentEvent.timecapsule.TimeCapsuleEventEnum;
import com.b210.damda.domain.timecapsule.repository.TimeCapsuleSEERepository;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

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

        String context = "님으로부터 타임캡슐 초대가 도착했습니다, 초대 코드 : ";
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

        String context = "님이 타임캡슐에 참여했습니다!";
        String eventName = "timecapsule-event";

        //fromNo를 통해 해당 유저의 이름과 이미지를 받아온다.
        UserNameAndImageDTO fromInfo = timeCapsuleSEERepository.getUserNameAndImage(userNo);

        ServerSentEvent<JsonNode> event = addOnEventService.buildServerSentEvent(eventName, new TimeCapsuleSSEDTO(userNo, fromInfo.getUserName(), fromInfo.getUserProfileImage(), context, inviteCode, addOnEventService.getNowTime(LocalDateTime.now().plusHours(9))));
        eventStreamService.sendEvent(fromNo, event);
    }

    public void TimecapsuleNoticeEventUsingSchedular(Long userNo, Long timecapsuleNo) {
        log.warn("개봉 가능 타임캡슐 알림");

        String context = "님이 타임캡슐에 참여했습니다!";
        String eventName = "timecapsule-event";

//        ServerSentEvent<JsonNode> event = addOnEventService.buildServerSentEvent(eventName, new TimeCapsuleSSEDTO(userNo, fromInfo.getUserName(), fromInfo.getUserProfileImage(), context, inviteCode, addOnEventService.getNowTime(LocalDateTime.now().plusHours(9))));
//        eventStreamService.sendEvent(userNo, event);
    }
}
