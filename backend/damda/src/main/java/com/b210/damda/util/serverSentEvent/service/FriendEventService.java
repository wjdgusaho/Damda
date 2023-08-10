package com.b210.damda.util.serverSentEvent.service;

import com.b210.damda.domain.dto.serverSentEvent.FriendEventEnum;
import com.b210.damda.domain.dto.serverSentEvent.ServerSentEventDTO;
import com.b210.damda.domain.friend.repository.FriendRepository;
import com.b210.damda.domain.friend.service.FriendService;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * 이벤트와 관련된 서비스입니다.
 */

@Service
@RequiredArgsConstructor
@Slf4j
public class FriendEventService {

    private final EventStreamService eventStreamService; //실제 스트림을 보내는 객체
    private final AddOnEventService addOnEventService;   //공통 로직에서 사용되는 이벤트 메서드
    private final FriendRepository friendRepository;

    public void friendEventService(long fromNo, FriendEventEnum type) {
        Long userNo = addOnEventService.getUserNo();
        String context = "default";
        String eventName = "friend-event";

        //fromNo를 통해 해당 유저의 이름과 이미지를 받아온다.
        String fromName = friendRepository.getUserNickname(fromNo);
        String fromImage = friendRepository.getUserProfileImage(fromNo);
        log.info("DEBUG {} {}", fromName, fromImage);

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

        ServerSentEvent<JsonNode> event = addOnEventService.buildServerSentEvent(eventName, new ServerSentEventDTO(userNo.toString(), fromName, fromImage, context, addOnEventService.getNowTime()));
        eventStreamService.sendEvent(fromNo, event);
    }


    //첫 로그인 시 밀렸던 모든 친구들을 조회하기
    public void checkAllFriendEvent() {
        log.info("부재중 모든 친구 체크 요청 로직 실행");
    }

}
