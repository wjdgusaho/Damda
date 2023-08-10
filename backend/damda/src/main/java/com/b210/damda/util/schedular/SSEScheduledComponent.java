package com.b210.damda.util.schedular;


import com.b210.damda.domain.timecapsule.repository.TimecapsuleRepository;
import com.b210.damda.util.serverSentEvent.service.EventStreamService;
import com.b210.damda.util.serverSentEvent.service.FriendEventService;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import reactor.core.publisher.DirectProcessor;
import reactor.core.publisher.FluxSink;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@RequiredArgsConstructor
@Slf4j
public class SSEScheduledComponent {


    @Scheduled(fixedRate = 3000) // 테스터
    public void scheduledTask() {
        log.info("스케줄링된 작업 실행: {}", System.currentTimeMillis());
        /*
1. 일정 시간마다 스케줄러가 시행된다.
2. lastResponseTimes Map을 순회하여 현재 시간과 비교하여 오래 '연결이 없는' userId를 찾아낸다.
3. 2번에서 얻은 userId를 가지고 'userFluxSinkMap'과 'disconnectProcessors'에 해당 키값에 Map이 존재하는지 탐색하고,
현재 userId로 실제 스트림이 존재하는지(Flux.on .. 무슨 메서드로 연결이 있는지 확인할 수 있는 걸로 인지하고 있음)한다.
4.  'userFluxSinkMap'과 'disconnectProcessors'에 둘 다 값이 있고, 실제 스트림이 있다면 정상적인 연결로 판단한다(접속중)
5. 만약 아니라면, 비정상적인 로직으로 판단하고 전부 제거하고 종료한다.
         */

        //동시성 문제? => 어차피 동시성으로 close되어도, 로그아웃 로직 발생 시 FE에서 자동으로 재연결을 수행한다.
        Map<Long, FluxSink<ServerSentEvent<JsonNode>>> nowUserFluxSinkMap = EventStreamService.userFluxSinkMap;
        // 방법 1: 향상된 for 루프 사용
        for (Map.Entry<Long, LocalDateTime> entry : EventStreamService.lastResponseTimes.entrySet()) {
            Long userId = entry.getKey();
            LocalDateTime userLastResponse = entry.getValue(); //유저의 마지막 응답 시간
            log.warn("TEST : 기록있는 유저 : {}, 마지막 시간 : {}", userId, userLastResponse);
            log.warn("시간 차이 : {}", Duration.between(LocalDateTime.now(), userLastResponse));


        }
    }


}
