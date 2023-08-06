package com.b210.damda.util.serverSentEvent.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventListService {

    //실제 스트림을 보내는 객체
    private final EventStreamService eventStreamService;

    /*
    유저 정보 불러오기
    */
    public Long getUserNo(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        Long userNo = (Long) principal;

        return userNo;
    }

    //Event Builder
    private ServerSentEvent<String> buildServerSentEvent(String eventName, String data) {
        return ServerSentEvent.<String>builder()
                .id(data.toString())
                .event(eventName)
                .data(data)
                .build();
    }

    //이벤트 확인용 테스트 이벤트
    public void testEvent() {
        //Long userNo = eventStreamService.getUserNo();
        Long userNo = 18L;
        String eventName = "custom-event";
        String eventData = "Custom event for User " + userNo;

        ServerSentEvent<String> event = buildServerSentEvent(eventName, eventData);
        eventStreamService.sendEvent(userNo, event);
    }


}
