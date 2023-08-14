package com.b210.damda.util.serverSentEvent.service;

import com.b210.damda.domain.dto.serverSentEvent.friend.FriendEventEnum;
import com.b210.damda.domain.dto.serverSentEvent.ServerSentEventDTO;
import com.b210.damda.domain.dto.serverSentEvent.friend.GetRequestToMeDTO;
import com.b210.damda.domain.dto.serverSentEvent.friend.UserNameAndImageDTO;
import com.b210.damda.domain.friend.repository.FriendRepository;
import com.b210.damda.domain.friend.repository.FriendSSERepository;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 친구 이벤트와 관련된 서비스입니다.
 */

@Service
@RequiredArgsConstructor
@Slf4j
public class FriendEventService {

    private final EventStreamService eventStreamService; //실제 스트림을 보내는 객체
    private final AddOnEventService addOnEventService;   //공통 로직에서 사용되는 이벤트 메서드
    private final FriendSSERepository friendSSERepository;

    public void friendEventService(long fromNo, FriendEventEnum type) {
        log.warn("친구 관련 로직 작동(friendEventService)");

        Long userNo = addOnEventService.getUserNo();

        String context = "default";
        String eventName = "friend-event";

        log.info("friendRepository.getUserNameAndImage .. 이 유저의 정보를 가져옵니다 : {}", userNo);
        //fromNo를 통해 해당 유저의 이름과 이미지를 받아온다.
        UserNameAndImageDTO fromInfo = friendSSERepository.getUserNameAndImage(userNo);
        log.info("TEST : {} {} ", fromInfo.getUserName(), fromInfo.getUserProfileImage());
        switch (type) {
            case ACCEPT:
                context = "님이 친구 요청을 승낙했습니다!";
                break;
            case REQUEST:
                context = "님으로부터 친구 요청이 도착했습니다. ";
                break;
            case REJECT:
                context = "님이 친구 요청을 거절했습니다...";
                break;
        }

        ServerSentEvent<JsonNode> event = addOnEventService.buildServerSentEvent(eventName, new ServerSentEventDTO(userNo, fromInfo.getUserName(), fromInfo.getUserProfileImage(), context, addOnEventService.getNowTime(LocalDateTime.now().plusHours(9))));
        eventStreamService.sendEvent(fromNo, event);
    }

    //첫 로그인 시 밀렸던 모든 친구들을 조회하기
    public void checkAllFriendEvent() {
        log.info("나에게 온 친구 요청 알림 로직");
        Long userNo = addOnEventService.getUserNo();
        log.info("userNo TEST : {}", userNo);
        List<GetRequestToMeDTO> requests = friendSSERepository.getRequestToMe(userNo);
        String eventName = "friend-event";
        String context = "님으로부터 친구 요청이 도착했습니다. ";

        log.warn("친구 요청 List Size : {}", requests.size());

        for (GetRequestToMeDTO request : requests) {
            log.info("친구 요청 리스트 순회 : {} {} {}", request.getFromName(), request.getFromNo(), request.getFromProfileImage());
            ServerSentEvent<JsonNode> event =
                    addOnEventService.buildServerSentEvent(eventName, new ServerSentEventDTO(request.getFromNo(),
                            request.getFromName(), request.getFromProfileImage(), context, addOnEventService.getNowTime(request.getDate())));
            eventStreamService.sendEvent(userNo, event);
        }
    }
}
