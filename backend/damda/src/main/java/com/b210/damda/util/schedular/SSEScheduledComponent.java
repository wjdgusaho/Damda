package com.b210.damda.util.schedular;


import com.b210.damda.domain.timecapsule.repository.TimecapsuleRepository;
import com.b210.damda.util.serverSentEvent.service.FriendEventService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class SSEScheduledComponent {
    private final TimecapsuleRepository timecapsuleRepository;
    private final FriendEventService friendEventService;

//    @Scheduled(fixedRate = 3000) // 테스터
//    public void scheduledTask() {
//        log.info("스케줄링된 작업 실행: {}", System.currentTimeMillis());
//        /*
//1. 일정 시간마다 스케줄러가 시행된다.
//2. lastResponseTimes Map을 순회하여 현재 시간과 비교하여 오래 '연결이 없는' userId를 찾아낸다.
//3. 2번에서 얻은 userId를 가지고 'userFluxSinkMap'과 'disconnectProcessors'에 해당 키값에 Map이 존재하는지 탐색하고,
//현재 userId로 실제 스트림이 존재하는지(Flux.on .. 무슨 메서드로 연결이 있는지 확인할 수 있는 걸로 인지하고 있음)한다.
//4.  'userFluxSinkMap'과 'disconnectProcessors'에 둘 다 값이 있고, 실제 스트림이 있다면 정상적인 연결로 판단한다(접속중)
//5. 만약 아니라면, 비정상적인 로직으로 판단하고 전부 제거하고 종료한다.
//         */
//
//    }


}
