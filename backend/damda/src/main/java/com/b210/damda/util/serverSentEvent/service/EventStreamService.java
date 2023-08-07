package com.b210.damda.util.serverSentEvent.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.FluxSink;

import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Function;

/**
 * 해당 서비스는 Flux를 통해 스트림 데이터를 제어하고(로그인/로그아웃)
 * 이벤트 발생 시 이를 연결된 스트림을 찾아 전송하는 이음매 역할을 한다.
 */
@Service
@Slf4j
public class EventStreamService {

    //동시성 처리를 위해 ConcurrentHashMap 사용, 해당 Map에 개별적인 클라이언트들의 Reactive Stream이 연결되어 저장(FluxSink 저장)
    private final Map<Long, FluxSink<ServerSentEvent<String>>> userFluxSinkMap = new ConcurrentHashMap<>();

    //최초 연결 시(로그인) Flux 생성 및 Map에 저장
    public Flux<ServerSentEvent<String>> connectStream(Long userNo) {
        log.info("connect 연결 성공, userNo : {}", userNo);
        //Sink맵 추가 후, onDispose 이벤트 시 제거하는 Flux 생성
        Flux<ServerSentEvent<String>> dataFlux =  Flux.create(sink -> userFluxSinkMap.put(userNo, sink.onDispose(() -> userFluxSinkMap.remove(userNo))));

        // 연결을 계속하기 위해 일정 시간마다 Event를 전송함
        Flux<ServerSentEvent<String>> maintainConnectFlux = Flux.interval(Duration.ofSeconds(30)).map(new Function<Long, ServerSentEvent<String>>() {
            @Override
            public ServerSentEvent<String> apply(Long tick) {
                return ServerSentEvent.<String>builder().event("custom-event").data("연결 유지").build();
            }
        });

        return Flux.merge(dataFlux, maintainConnectFlux);
    }

    public void disconnectStream(Long userNo) {
        log.info("disconnect 로그아웃, userNo : {}", userNo);
        userFluxSinkMap.remove(userNo);
    }

    //특정 이벤트를 발생시켜 특정 사용자에게 이벤트를 전송
    public void sendEvent(Long userNo, ServerSentEvent<String> event) {
        log.info("SendEvent 수행");
        //UserNo를 통해 해당 클라이언트의 고유 스트림의 sink를 찾아왔음.
        FluxSink<ServerSentEvent<String>> sink = userFluxSinkMap.get(userNo);
        if (sink != null) {
            log.info("sink 정보 : {}", sink);
            log.info("이벤트 정보 : {}", event);
            sink.next(event);
        }
    }

    //여러 사용자에게 Send를 보낼 경우 (Overload)
    public void sendEvent(List<Long> users, ServerSentEvent<String> event) {
        log.info("SendEvent(List) 수행");
        for (Long userNo : users) {
            FluxSink<ServerSentEvent<String>> sink = userFluxSinkMap.get(userNo);
            if (sink != null) {
                log.info("sink 정보 : {}", sink);
                log.info("이벤트 정보 : {}", event);
                sink.next(event);
            }
        }
    }
}