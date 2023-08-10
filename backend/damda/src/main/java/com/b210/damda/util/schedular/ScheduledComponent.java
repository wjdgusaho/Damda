package com.b210.damda.util.schedular;


import com.b210.damda.domain.dto.serverSentEvent.FriendEventEnum;
import com.b210.damda.domain.timecapsule.repository.TimecapsuleRepository;
import com.b210.damda.util.serverSentEvent.service.EventStreamService;
import com.b210.damda.util.serverSentEvent.service.FriendEventService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

@Component
@RequiredArgsConstructor
@Slf4j
public class ScheduledComponent {
    private final TimecapsuleRepository timecapsuleRepository;
    private final FriendEventService friendEventService;

    @Scheduled(fixedRate = 3000) // 1초마다 실행
    public void scheduledTask() {
        log.info("스케줄링된 작업 실행: {}", System.currentTimeMillis());
        timecapsuleRepository.cardAble(true);
        // userFluxSinkMap에 접근
//        log.info("size : {}", EventStreamService.userFluxSinkMap.size());
    }

    //서울시간 00시마다 timecapsule_mapping 테이블에 card_able 컬럼들이 모두 (true 또는 1)로 수정되게 변경
    @Scheduled(cron = "0 00 00 * * *", zone = "Asia/Seoul") // 매일 00시 00분 00초
    public void scheduledEvent() {
        timecapsuleRepository.cardAble(true);
    }
}
