package com.b210.damda.util.serverSentEvent.service;


import com.b210.damda.domain.dto.serverSentEvent.ServerSentEventDTO;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import reactor.core.publisher.DirectProcessor;
import reactor.core.publisher.Flux;
import reactor.core.publisher.FluxSink;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Function;

/**
 * 해당 서비스는 Flux를 통해 스트림 데이터를 제어하고(로그인/로그아웃)
 * 이벤트 발생 시 이를 연결된 스트림을 찾아 전송하는 이음매 역할을 한다.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EventStreamService {

    private final AddOnEventService addOnEventService;

    //스트림 저장 : 동시성 처리를 위해 ConcurrentHashMap 사용, 해당 Map에 개별적인 클라이언트들의 Reactive Stream이 연결되어 저장(FluxSink 저장)
    private final Map<Long, FluxSink<ServerSentEvent<JsonNode>>> userFluxSinkMap = new ConcurrentHashMap<>();

    //자동 연결(heartbeat)통로 저장 : 자동으로 서버 -> 클라이언트로 주기적 요청을 보내는 스트림(maintainConnectFlux) 제거를 위한 Processors를 생성 후 보관
    private final Map<Long, DirectProcessor<Void>> disconnectProcessors = new ConcurrentHashMap<>();

    //마지막 heartbeat 시간대 체크 : 서버는 클라이언트의 연결 상태를 위해 주기적으로 마지막 접속 시간을 체크함, 클라이언트의 답신이 없어질 경우 끊어짐으로 판단
    private final Map<Long, LocalDateTime> lastResponseTimes = new ConcurrentHashMap<>();

    public void test() {
        log.warn("테스트 userFluxSinkMap 값 : {}", userFluxSinkMap.size());
        for (int i = 0; i < userFluxSinkMap.size(); i++) {
            log.info("details : {}", userFluxSinkMap.get(i));
        }
        log.warn("테스트 disconnectProcessors 값 : {}", disconnectProcessors.size());
        for (int i = 0; i < disconnectProcessors.size(); i++) {
            log.info("details : {}", disconnectProcessors.get(i));
        }
        log.warn("테스트 lastResponseTimes 값 : {}", lastResponseTimes.size());
        for (int i = 0; i < lastResponseTimes.size(); i++) {
            log.info("details : {}", lastResponseTimes.get(i));
        }
    }

    //최초 연결 시(로그인), 혹은 재연결 시 Flux 생성 및 Map에 저장
    public Flux<ServerSentEvent<JsonNode>> connectStream() {
        long userNo = addOnEventService.getUserNo();
        log.info("connectStream, userNo : {}", userNo);

        // 기존 스트림 제거
        if(userFluxSinkMap.containsKey(userNo)) {
            log.info("기존 {}의 스트림Flux가 존재하기에 Sink를 종료합니다.", userNo);
            // 1. 기존의 FluxSink 종료
            userFluxSinkMap.get(userNo).complete();

            // 2. maintainConnectFlux 종료
            if(disconnectProcessors.containsKey(userNo)) {
                disconnectProcessors.get(userNo).onComplete();
                disconnectProcessors.remove(userNo);
            }

            //3. Map에 기록 제거
            userFluxSinkMap.remove(userNo);
        }


        //접속 시간 등록
        lastResponseTimes.put(userNo, LocalDateTime.now());

        //Sink맵 추가 후, onDispose 이벤트 시 제거하는 Flux 생성
        Flux<ServerSentEvent<JsonNode>> dataFlux = Flux.create(sink -> userFluxSinkMap.put(userNo, sink.onDispose(() -> userFluxSinkMap.remove(userNo))));

        //연결 종료를 위한 Processor 적용
        DirectProcessor<Void> processor = DirectProcessor.create();
        disconnectProcessors.put(userNo, processor);

        // 연결을 계속하기 위해 일정 시간마다 Event를 전송함. 해당 Flux는 기존 FluxSink와 별도의 로직이다.
        Flux<ServerSentEvent<JsonNode>> maintainConnectFlux =
                Flux.interval(Duration.ofSeconds(3))
                        .takeUntilOther(processor)  // processor가 신호를 보내면(로그아웃) 중지
                        .map(new Function<Long, ServerSentEvent<JsonNode>>() {
                            @Override
                            public ServerSentEvent<JsonNode> apply(Long tick) {
                                return addOnEventService.buildServerSentEvent("check-connection", new ServerSentEventDTO(null, "heartbeat", LocalDateTime.now().toString()));
                            }
                        });

        //takeUntil을 사용하여 dataFlux가 종료되면 maintainConnectFlux도 종료되도록 설정
        return Flux.merge(dataFlux, maintainConnectFlux.takeUntil(other -> dataFlux == null));
    }

    //클라이언트에서 응답 존재할 경우(정상적으로 연결이 이어질 경우) 마지막 시간 갱신
    public void checkConnection() {
        log.info("checkConnection : 클라이언트에서 응답 수신하였음");
        lastResponseTimes.put(addOnEventService.getUserNo(), LocalDateTime.now());
    }

    //로그아웃시 종료 로직
    public void disconnectStream() {
        log.info("disconnectStream(), 로그아웃");
        long userNo = addOnEventService.getUserNo();

        //저장된 스트림 종료 및 싱크 제거, 응답 기록 제거
        endAndRemoveStream(userNo);

        //로그아웃 알림
        ServerSentEvent<JsonNode> logoutEvent = addOnEventService.buildServerSentEvent("custom-event", new ServerSentEventDTO(null, "로그아웃 진행", LocalDateTime.now().toString() ));
        sendEvent(userNo, logoutEvent);
    }

    //미답신 시 종료 로직
    public void disconnectStream(long userNo) {
        log.info("disconnectStream, 미답신 {}", userNo);
        //저장된 스트림 종료 및 싱크 제거
        endAndRemoveStream(userNo);

        //끊어짐 알림
        ServerSentEvent<JsonNode> disconnectEvent = addOnEventService.buildServerSentEvent("end-of-stream", new ServerSentEventDTO(null, "클라이언트 미답신으로 인한 연결 끊어짐", LocalDateTime.now().toString()));
        sendEvent(userNo, disconnectEvent);
    }
    //저장된 스트림 종료 및 싱크 제거
    public void endAndRemoveStream(long userNo) {
        log.info("endAndRemoveStream, 저장된 스트림 종료 및 싱크 제거, {}", userNo);

        //프로세서 종료
        DirectProcessor<Void> processor = disconnectProcessors.get(userNo);
        if (processor != null) {
            log.info("processor.onComplete()");
            processor.onComplete(); //종료
            disconnectProcessors.remove(userNo);
        }

        FluxSink<ServerSentEvent<JsonNode>> sink = userFluxSinkMap.get(userNo);
        if (sink != null) {
            sink.complete();  // 스트림 종료
        }
        userFluxSinkMap.remove(userNo);
        lastResponseTimes.remove(userNo);
    }

    //특정 이벤트를 발생시켜 특정 사용자에게 이벤트를 전송
    public void sendEvent(Long userNo, ServerSentEvent<JsonNode> event) {
        log.info("SendEvent 수행");
        //UserNo를 통해 해당 클라이언트의 고유 스트림의 sink를 찾아왔음.
        FluxSink<ServerSentEvent<JsonNode>> sink = userFluxSinkMap.get(userNo);
        if (sink != null) {
            log.info("sink 정보 : {}", sink);
            log.info("이벤트 정보 : {}", event);
            sink.next(event);
        }
    }

    //여러 사용자에게 Send를 보낼 경우 (Overload)
    public void sendEvent(List<Long> users, ServerSentEvent<JsonNode> event) {
        log.info("SendEvent(List) 수행");
        for (Long userNo : users) {
            FluxSink<ServerSentEvent<JsonNode>> sink = userFluxSinkMap.get(userNo);
            if (sink != null) {
                log.info("sink 정보 : {}", sink);
                log.info("이벤트 정보 : {}", event);
                sink.next(event);
            }
        }
    }
}