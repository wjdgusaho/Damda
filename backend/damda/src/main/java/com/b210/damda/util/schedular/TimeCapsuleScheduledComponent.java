package com.b210.damda.util.schedular;

import com.b210.damda.domain.timecapsule.repository.TimeCapsuleSchedularRepository;
import com.b210.damda.domain.timecapsule.repository.TimecapsuleRepository;
import com.b210.damda.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class TimeCapsuleScheduledComponent {

    private final TimeCapsuleSchedularRepository timeCapsuleSchedularRepository;

    //서울시간 00시마다 timecapsule_mapping 테이블에 card_able 컬럼들이 모두 (true 또는 1)로 수정되게 변경
    @Scheduled(cron = "0 00 00 * * *", zone = "Asia/Seoul") // 매일 00시 00분 00초
    public void cardAndFileRefill() {
        log.info("[EVENT] : 카드 및 파일 초기화");
        timeCapsuleSchedularRepository.cardAble(true, true);
    }

    //타임 캡슐 만료되었을 시 알림, 매일 00시에 실행
//    @Scheduled(cron = "0 00 00 * * *", zone = "Asia/Seoul") // 매일 00시 00분 00초
//    public void checkTimeCapsule() {
//        log.info("[EVENT] : 타임 캡슐 만료 알림");
//        timecapsuleRepository
//    }
}
