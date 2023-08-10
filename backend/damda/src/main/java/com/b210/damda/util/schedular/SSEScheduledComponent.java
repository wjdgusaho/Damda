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

    @Scheduled(fixedRate = 3000) // 테스터
    public void scheduledTask() {


        log.info("스케줄링된 작업 실행: {}", System.currentTimeMillis());
        timecapsuleRepository.cardAble(true);
        // userFluxSinkMap에 접근
//        log.info("size : {}", EventStreamService.userFluxSinkMap.size());
    }


}
