package com.b210.damda.util.serverSentEvent.controller;


import com.b210.damda.util.serverSentEvent.service.FriendEventService;
import com.b210.damda.util.serverSentEvent.service.EventStreamService;
import com.b210.damda.util.serverSentEvent.service.TimeCapsuleEventService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

@RestController
@Slf4j
@RequiredArgsConstructor
public class SSEController {

    private final EventStreamService eventStreamService;
    private final FriendEventService friendEventService;
    private final TimeCapsuleEventService timeCapsuleEventService;

    //최초 접속 시 로그인 이벤트. 이를 통해 스트림 파이프라인 구축 가능
    //MediaType 명시를 통해 엔드포인트가 text/event-stream을 반환하도록 강제함.
    @GetMapping(value = "/sse/login", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<ServerSentEvent<String>> login() {
        log.info("로그인 개방");

        //또한 로그인 시 밀렸던 푸시 알림 체크 로직도 확인해야 함
        //1. 확인하지 못했던 친구 상태 알림 로직
        friendEventService.checkAllFriendEvent();
        //2. 확인하지 못했던 타임 캡슐 알림 로직

        //return eventStreamService.connect(eventListService.getUserNo());
        return eventStreamService.connectStream(18L); //테스팅용
    }

    //로그아웃 시 스트림 제거
    @GetMapping(value = "/sse/logout")
    public void logout() {
//        eventStreamService.disconnectStream(eventListService.getUserNo());
        eventStreamService.disconnectStream(18L); //테스팅용
    }

    //테스트용
    @GetMapping(value = "/sse/test")
    public void test(@RequestParam long no) {
        friendEventService.friendRequestEvent(no);
    }



}