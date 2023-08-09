package com.b210.damda.util.serverSentEvent.service;

import com.b210.damda.domain.friend.service.FriendService;
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
    private final FriendService friendService;

    //친구 요청 이벤트 : 나(userNo) -> 친구 요청하는 사용자(frinedNo)
    public void friendRequestEvent(long friendNo) {
        Long userNo = addOnEventService.getUserNo();
        log.info("가져온 유저 값 : ", userNo);
        String eventName = "custom-event";
        String eventData = userNo + "로부터 친구 요청이 도착했습니다. " + addOnEventService.getNowTime();

        //eventBuilder로 이벤트 생성
        ServerSentEvent<String> event = addOnEventService.buildServerSentEvent(eventName, eventData);
        eventStreamService.sendEvent(friendNo, event);
    }

    //친구 요청 수락 이벤트(내가 상대방의 친구 요청을 승낙함)
    public void friendAcceptEvent(long fromNo) {
        Long userNo = addOnEventService.getUserNo();
        String eventName = "custom-event";
        String eventData = userNo + "님이 친구 요청을 승낙했습니다!"  + addOnEventService.getNowTime();

        ServerSentEvent<String> event = addOnEventService.buildServerSentEvent(eventName, eventData);
        eventStreamService.sendEvent(fromNo, event);
    }

    //친구 요청 거절 이벤트(요청 받은 내가 상대방에게 알림 전송)
    public void friendDenyEvent(long fromNo) {
        Long userNo = addOnEventService.getUserNo();
//        Long userNo = 18L;
        String eventName = "custom-event";
        String eventData = userNo + "님이 친구 요청을 거절했습니다..."  + addOnEventService.getNowTime();

        ServerSentEvent<String> event = addOnEventService.buildServerSentEvent(eventName, eventData);
        eventStreamService.sendEvent(fromNo, event);
    }

    //첫 로그인 시 밀렸던 모든 친구들을 조회하기
    public void checkAllFriendEvent() {
        log.info("부재중 모든 친구 체크 요청 로직 실행");
    }

}
