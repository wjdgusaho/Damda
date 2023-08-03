package com.b210.damda.util.notification.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;

@Slf4j
@RestController
@RequestMapping("/sse")
public class NotificationController {

    @GetMapping(value = "/login", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter loginAndConnect(@RequestBody long userNo) {
        log.info("SSE Test Endpoint Accessed");

        SseEmitter emitter = new SseEmitter();
        sendSseNotification(emitter);

        return emitter;
    }

    private void sendSseNotification(SseEmitter emitter) {
        // 가상의 데이터 또는 실제 데이터를 생성하여 SSE를 통해 클라이언트로 전송
        new Thread(() -> {
            try {
                for (int i = 0; i < 5; i++) {
                    emitter.send(SseEmitter.event().data("SSE - " + i));
                    Thread.sleep(1000); // 1초 간격으로 데이터를 보냄
                }
                emitter.complete();
            } catch (IOException | InterruptedException e) {
                log.error("Error while sending SSE notification: {}", e.getMessage());
                emitter.completeWithError(e);
            }
        }).start();
    }
}
