package com.b210.damda.util.serverSentEvent.controller;


import com.b210.damda.domain.entity.User.User;
import com.b210.damda.util.serverSentEvent.service.FriendEventService;
import com.b210.damda.util.serverSentEvent.service.EventStreamService;
import com.b210.damda.util.serverSentEvent.service.TimeCapsuleEventService;
import com.fasterxml.jackson.databind.JsonNode;
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

    @GetMapping(value = "/sse/test")
    public void test() {
        eventStreamService.test();
    }

    //최초 접속 시 로그인 이벤트. 이를 통해 스트림 파이프라인 구축 가능
    //MediaType 명시를 통해 엔드포인트가 text/event-stream을 반환하도록 강제함.
    @GetMapping(value = "/sse/login")
    public Flux<ServerSentEvent<JsonNode>> login() {
        log.info("로그인 개방");
        //1. 확인하지 못했던 친구 상태 알림 로직
        //friendEventService.checkAllFriendEvent();
        //2. 확인하지 못했던 타임 캡슐 알림 로직

        return eventStreamService.connectStream();
    }

    @GetMapping(value = "/sse/check")
    public void checkConnection() {
        eventStreamService.checkConnection();
    }

}