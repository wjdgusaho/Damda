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
public class FriendScheduledComponent {
    private final TimecapsuleRepository timecapsuleRepository;

    //서울시간 00시마다 timecapsule_mapping 테이블에 card_able 컬럼들이 모두 (true 또는 1)로 수정되게 변경
    @Scheduled(cron = "0 00 00 * * *", zone = "Asia/Seoul") // 매일 00시 00분 00초
    public void scheduledEvent() {
        timecapsuleRepository.cardAble(true, true);
    }


}
