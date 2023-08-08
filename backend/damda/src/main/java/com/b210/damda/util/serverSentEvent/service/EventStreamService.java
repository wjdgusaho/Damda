package com.b210.damda.util.serverSentEvent.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
    private final Map<Long, FluxSink<ServerSentEvent<String>>> userFluxSinkMap = new ConcurrentHashMap<>();

    //자동 연결(heartbeat)통로 저장 : 자동으로 서버 -> 클라이언트로 주기적 요청을 보내는 스트림(maintainConnectFlux) 제거를 위한 Processors를 생성 후 보관
    private final Map<Long, DirectProcessor<Void>> disconnectProcessors = new ConcurrentHashMap<>();

    //마지막 heartbeat 시간대 체크 : 서버는 클라이언트의 연결 상태를 위해 주기적으로 마지막 접속 시간을 체크함, 클라이언트의 답신이 없어질 경우 끊어짐으로 판단
    private final Map<Long, LocalDateTime> lastResponseTimes = new ConcurrentHashMap<>();


    //테스트용
    public void size() {
        log.info("사이즈 : {}", userFluxSinkMap.size());
    }

    //최초 연결 시(로그인), 혹은 재연결 시 Flux 생성 및 Map에 저장
    public Flux<ServerSentEvent<String>> connectStream() {
        long userNo = addOnEventService.getUserNo();
        log.info("connect 연결 성공, userNo : {}", userNo);

        //현재 연결된 스트림이 존재할 경우 기존 스트림을 제거
        if (userFluxSinkMap.get(userNo) != null) {
            log.info("기존 스트림 제거");
            disconnectStream(); //로그아웃 로직
        }

        //접속 시간 등록
        lastResponseTimes.put(userNo, LocalDateTime.now());

        //Sink맵 추가 후, onDispose 이벤트 시 제거하는 Flux 생성
        Flux<ServerSentEvent<String>> dataFlux = Flux.create(sink -> userFluxSinkMap.put(userNo, sink.onDispose(() -> userFluxSinkMap.remove(userNo))));

        //연결 종료를 위한 Processor 적용
        DirectProcessor<Void> processor = DirectProcessor.create();
        disconnectProcessors.put(userNo, processor);

        // 연결을 계속하기 위해 일정 시간마다 Event를 전송함. 해당 Flux는 기존 FluxSink와 별도의 로직이다.
        Flux<ServerSentEvent<String>> maintainConnectFlux =
                Flux.interval(Duration.ofSeconds(5))
                        .takeUntilOther(processor)  // processor가 신호를 보내면(로그아웃) 중지
                        .doOnEach(signal -> {
                            // 현재 시간 측정하여 15초 동안 응답이 없을 경우 중지(커넥션 종료)
                            LocalDateTime lastResponseTime = lastResponseTimes.get(userNo);
                            log.warn("테스팅 1 {}", userNo);
                            log.warn("테스팅 2 {}", Duration.between(lastResponseTime, LocalDateTime.now()).toSeconds());
                            log.info("클라이언트 -> 서버로 응답 없음, 시간 : {}", userNo);
                            if (lastResponseTime != null && Duration.between(lastResponseTime, LocalDateTime.now()).toSeconds() > 15) {
                                log.info("디스컨넥팅");
                                disconnectStream(userNo);
                            }
                            //만약 답장 왔을 경우 해당 Map에 현재 시간으로 갱신하는 로직 추가
                        })
                        .map(new Function<Long, ServerSentEvent<String>>() {
                            @Override
                            public ServerSentEvent<String> apply(Long tick) {
                                log.info("heartbeat : {} {}", tick, userNo);
                                return addOnEventService.buildServerSentEvent("check-connection", "heartbeat");
                            }
                        });

        //takeUntil을 사용하여 dataFlux가 종료되면 maintainConnectFlux도 종료되도록 설정
        return Flux.merge(dataFlux, maintainConnectFlux.takeUntil(other -> dataFlux == null));
    }

    //로그아웃시 종료 로직
    public void disconnectStream() {
        long userNo = addOnEventService.getUserNo();
        //프로세서 종료
        DirectProcessor<Void> processor = disconnectProcessors.get(userNo);
        if (processor != null) {
            log.info("프로세스 종료");
            processor.onComplete(); //종료
            disconnectProcessors.remove(userNo);
        }

        //로그아웃 알림
        ServerSentEvent<String> logoutEvent = addOnEventService.buildServerSentEvent("custom-event", "로그아웃 진행");
        sendEvent(userNo, logoutEvent);

        //저장된 스트림 종료 및 싱크 제거
        endAndRemoveStream(userNo);
    }

    //미답신 시 종료 로직
    public void disconnectStream(long userNo) {
        //프로세서 종료
        DirectProcessor<Void> processor = disconnectProcessors.get(userNo);
        if (processor != null) {
            log.info("프로세스 종료");
            processor.onComplete(); //종료
            disconnectProcessors.remove(userNo);
        }

        //끊어짐 알림
        ServerSentEvent<String> disconnectEvent = addOnEventService.buildServerSentEvent("end-of-stream", "클라이언트 미답신으로 인한 연결 끊어짐");
        sendEvent(userNo, disconnectEvent);

        //저장된 스트림 종료 및 싱크 제거
        endAndRemoveStream(userNo);
    }

    //저장된 스트림 종료 및 싱크 제거
    public void endAndRemoveStream(long userNo) {
        FluxSink<ServerSentEvent<String>> sink = userFluxSinkMap.get(userNo);
        if (sink != null) {
            sink.complete();  // 스트림 종료
            log.info("disconnect : 스트림 종료, {}", userNo);
        }
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