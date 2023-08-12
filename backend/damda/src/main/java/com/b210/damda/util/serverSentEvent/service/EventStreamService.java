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
 * 학습용이기에, 실제 로직보다 주석이 많을 수 있습니다.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EventStreamService {

    private final AddOnEventService addOnEventService;

    //스트림 저장 : 동시성 처리를 위해 ConcurrentHashMap 사용, 해당 Map에 개별적인 클라이언트들의 Reactive Stream의 기록이 연결되어 저장(FluxSink 저장)
    //주의 : 실제 스트림이 저장된 것은 아님
    static public final Map<Long, FluxSink<ServerSentEvent<JsonNode>>> userFluxSinkMap = new ConcurrentHashMap<>();

    //자동 연결(heartbeat)통로 저장 : 자동으로 서버 -> 클라이언트로 주기적 요청을 보내는 스트림(maintainConnectFlux) 제거를 위한 Processors를 생성 후 보관
    static public final Map<Long, DirectProcessor<Void>> disconnectProcessors = new ConcurrentHashMap<>();

    //마지막 heartbeat 시간대 체크 : 서버는 클라이언트의 연결 상태를 위해 주기적으로 마지막 접속 시간을 체크함, 클라이언트의 답신이 장기간 없을 경우 끊어짐으로 판단
    static public final Map<Long, LocalDateTime> lastResponseTimes = new ConcurrentHashMap<>();

    //최초 연결 시(로그인), 혹은 재연결 시 Flux 생성 및 Map에 저장
    public Flux<ServerSentEvent<JsonNode>> connectStream() {
        long userNo = addOnEventService.getUserNo();
        log.info("connectStream, userNo : {}", userNo);


//        log.info("여기 들어가서");
////        endAndRemoveStream(userNo);
//        log.info("나올수가 없다.");

        //이후 재연결 로직 발생
        //접속 시간 등록
        lastResponseTimes.put(userNo, LocalDateTime.now().plusHours(9));
        log.info("접속 시간 등록 : {}", lastResponseTimes.get(userNo));
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
                                return addOnEventService.buildServerSentEvent("check-connection", new ServerSentEventDTO(null, null,null,"heartbeat", addOnEventService.getNowTime(LocalDateTime.now().plusHours(9))));
                            }
                        });

        /*
        두 개의 Flux 스트림 (dataFlux와 maintainConnectFlux)을 병합,
        두 스트림에서 발생하는 이벤트들이 순차적으로 나타나지 않고, 각 스트림에서 이벤트가 발생할 때마다 해당 이벤트를 다음 단계로 전달하는 것을 의미

        즉, 이 병합된 스트림은 서버에서 클라이언트로 이어진 하나의 통로(reactive stream)에 연결되며,
        이 통로를 통해 dataFlux 또는 maintainConnectFlux에서 발생하는 이벤트가 서버에서 클라이언트로 전송
         */
        log.info("Flux.merge() 수행");
        return Flux.merge(dataFlux, maintainConnectFlux);
    }

    //클라이언트에서 응답 존재할 경우(정상적으로 연결이 이어질 경우) 마지막 시간 갱신
    public Flux<ServerSentEvent<JsonNode>> checkConnection() {
        log.info("checkConnection : 클라이언트에서 응답 수신하였음");
        lastResponseTimes.put(addOnEventService.getUserNo(), LocalDateTime.now().plusHours(9));
        return Flux.empty();
    }

    //로그아웃시 종료 로직
    public void disconnectStreamLogout(long userNo) {
        log.info("disconnectStream(), 로그아웃 : {}", userNo);
        //저장된 스트림 종료 및 싱크 제거, 응답 기록 제거
        endAndRemoveStream(userNo);
        log.info("removeStream 완료");

//        //로그아웃 알림
//        ServerSentEvent<JsonNode> logoutEvent = addOnEventService.buildServerSentEvent("logout-event", new ServerSentEventDTO(null, null, null, "로그아웃 진행", addOnEventService.getNowTime(LocalDateTime.now().plusHours(9))));
//        sendEvent(userNo, logoutEvent);
    }

    //미답신 시 종료 로직 : 현재 비정상적 종료를 시행, 스케줄러에서 사용
    public void disconnectStream(long userNo) {
        log.info("disconnectStream, 미답신 {}", userNo);

        //끊어짐 알림 : 해당 알림이 클라이언트로 가고, 클라이언트가 만약 현재 접속중이라면 10초 뒤에 다시 로그인 로직을 실행한다.
        ServerSentEvent<JsonNode> disconnectEvent = addOnEventService.buildServerSentEvent("end-of-stream", new ServerSentEventDTO(null, null, null, "클라이언트 장기 미답신으로 인한 연결 끊어짐", addOnEventService.getNowTime(LocalDateTime.now().plusHours(9))));
        sendEvent(userNo, disconnectEvent);

        //저장된 스트림 종료 및 싱크 제거
        endAndRemoveStream(userNo);
    }

    //저장된 스트림 종료 및 싱크 제거, 외부 스케줄러에서 종료 로직을 사용할 수 있기에 synchronized 처리하였다.
    public synchronized void endAndRemoveStream(long userNo) {
        log.info("endAndRemoveStream, 저장된 스트림 종료 및 싱크 제거 Map에 유저 정보 제거, {}", userNo);

        //실제 연결된 Reactive Stream Sink를 제거한다.
        FluxSink<ServerSentEvent<JsonNode>> sink = userFluxSinkMap.get(userNo);
        if (sink != null) {
            sink.complete();  // 실제 스트림 종료
        }
        //이후 Map 객체에 명시되었던 user정보를 제거한다.
        if(userFluxSinkMap.get(userNo) != null) userFluxSinkMap.remove(userNo);


        //이후 주기적으로 HeartBeat를 보내는 maintainConnectFlux를 제거하기 위해 Proccessor를 제거한다.
        //주 : 해당 Flux는 .takeUntilOther(processor)를 통해 해당 프로세스와 연결되었다.
        DirectProcessor<Void> processor = disconnectProcessors.get(userNo);
        if (processor != null) {
            log.info("processor.onComplete()");
            processor.onComplete(); //프로세서 종료
            disconnectProcessors.remove(userNo); //프로세서 정보를 가진 Map에서도 삭제
        }

        //마지막으로 Times 배열에 유저 정보를 제거한다. 이로써 완전히 스트림과, 스트림이 명시된 Map이 제거되었다.
        if(lastResponseTimes.get(userNo) != null) lastResponseTimes.remove(userNo);
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