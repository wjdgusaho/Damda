package com.b210.damda.util.serverSentEvent.service;

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
    private final Map<Long, FluxSink<ServerSentEvent<String>>> userFluxSinkMap = new ConcurrentHashMap<>();

    public void test() {
        log.warn("테스트 userFluxSinkMap 값 : {}", userFluxSinkMap.size());
        for (int i = 0; i < userFluxSinkMap.size(); i++) {
            log.info("details : {}", userFluxSinkMap.get(i));
        }
    }

    //최초 연결 시(로그인), 혹은 재연결 시 Flux 생성 및 Map에 저장
    public Flux<ServerSentEvent<String>> connectStream() {
        long userNo = addOnEventService.getUserNo();
        log.info("connectStream, userNo : {}", userNo);

        // 기존 스트림 제거
        if(userFluxSinkMap.containsKey(userNo)) {
            log.info("기존 {}의 스트림Flux가 존재하기에 Sink를 종료합니다.", userNo);
            // 1. 기존의 FluxSink 종료
            userFluxSinkMap.get(userNo).complete();


            //3. Map에 기록 제거
            userFluxSinkMap.remove(userNo);
        }


        //Sink맵 추가 후, onDispose 이벤트 시 제거하는 Flux 생성
        Flux<ServerSentEvent<String>> dataFlux = Flux.create(sink -> userFluxSinkMap.put(userNo, sink.onDispose(() -> userFluxSinkMap.remove(userNo))));


        //takeUntil을 사용하여 dataFlux가 종료되면 maintainConnectFlux도 종료되도록 설정
        return dataFlux;
    }

    //클라이언트에서 응답 존재할 경우(정상적으로 연결이 이어질 경우) 마지막 시간 갱신
    public void checkConnection() {
        log.info("checkConnection : 클라이언트에서 응답 수신하였음");
//        lastResponseTimes.put(addOnEventService.getUserNo(), LocalDateTime.now());
    }

    //로그아웃시 종료 로직
    public void disconnectStream() {
        log.info("disconnectStream(), 로그아웃");
        long userNo = addOnEventService.getUserNo();

        //저장된 스트림 종료 및 싱크 제거, 응답 기록 제거
        endAndRemoveStream(userNo);

        //로그아웃 알림
        ServerSentEvent<String> logoutEvent = addOnEventService.buildServerSentEvent("custom-event", "로그아웃 진행");
        sendEvent(userNo, logoutEvent);
    }

    //미답신 시 종료 로직
    public void disconnectStream(long userNo) {
        log.info("disconnectStream, 미답신 {}", userNo);
        //저장된 스트림 종료 및 싱크 제거
        endAndRemoveStream(userNo);

        //끊어짐 알림
        ServerSentEvent<String> disconnectEvent = addOnEventService.buildServerSentEvent("end-of-stream", "클라이언트 미답신으로 인한 연결 끊어짐");
        sendEvent(userNo, disconnectEvent);
    }
    //저장된 스트림 종료 및 싱크 제거
    public void endAndRemoveStream(long userNo) {
        log.info("endAndRemoveStream, 저장된 스트림 종료 및 싱크 제거, {}", userNo);

//        //프로세서 종료
//        DirectProcessor<Void> processor = disconnectProcessors.get(userNo);
//        if (processor != null) {
//            log.info("processor.onComplete()");
//            processor.onComplete(); //종료
//            disconnectProcessors.remove(userNo);
//        }
//
//        FluxSink<ServerSentEvent<String>> sink = userFluxSinkMap.get(userNo);
//        if (sink != null) {
//            sink.complete();  // 스트림 종료
//        }
//        userFluxSinkMap.remove(userNo);
//        lastResponseTimes.remove(userNo);
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