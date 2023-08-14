package com.b210.damda.util.schedular;

import com.b210.damda.domain.timecapsule.repository.TimeCapsuleSEERepository;
import com.b210.damda.domain.user.repository.UserRepository;
import com.b210.damda.util.serverSentEvent.service.AddOnEventService;
import com.b210.damda.util.serverSentEvent.service.EventStreamService;
import com.b210.damda.util.serverSentEvent.service.FriendEventService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class test {

    final FriendEventService friendEventService;
    final EventStreamService eventStreamService;
    final AddOnEventService addOnEventService;
    final TimeCapsuleSEERepository timeCapsuleSEERepository;
    private final UserRepository userRepository;
    @Scheduled(fixedRate = 3000) // 테스터
    public void test() {
        log.info("테스터 스케줄러 동작");
        LocalDateTime currentTime = LocalDateTime.now();
        log.info("현재 시간: " + currentTime);
        //전체 DB 순회하여
    }

//    //서울시간 00시마다 timecapsule_mapping 테이블에 card_able 컬럼들이 모두 (true 또는 1)로 수정되게 변경
//    @Scheduled(cron = "0 00 00 * * *", zone = "Asia/Seoul") // 매일 00시 00분 00초
//    public void scheduledEvent() {
//        timecapsuleRepository.cardAble(true, true);
//    }

}
