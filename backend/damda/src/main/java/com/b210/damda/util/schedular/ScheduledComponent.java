package com.b210.damda.util.schedular;


import com.b210.damda.util.serverSentEvent.service.EventStreamService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

@Component
@RequiredArgsConstructor
@Slf4j
public class ScheduledComponent {
//    @Scheduled(fixedRate = 2000) // 1초마다 실행
//    public void scheduledTask() {
//        log.info("스케줄링된 작업 실행: {}", System.currentTimeMillis());
//        // userFluxSinkMap에 접근
//        log.info("size : {}", EventStreamService.userFluxSinkMap.size());
//    }

    @Scheduled(cron = "0 39 17 * * *", zone = "Asia/Seoul") // 매일 00시 00분 00초
    public void scheduledEvent() {
        // 여기에 특정 이벤트를 발생시키는 로직을 작성
        System.out.println("특정 이벤트 발생: " + System.currentTimeMillis());
    }
}
