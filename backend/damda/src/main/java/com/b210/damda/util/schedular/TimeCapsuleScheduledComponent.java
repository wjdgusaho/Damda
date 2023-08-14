package com.b210.damda.util.schedular;

import com.b210.damda.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class TimeCapsuleScheduledComponent {

    private final UserRepository userRepository;

    //서울시간 00시마다 출석 카운트가 갱신되게 변경
    @Scheduled(cron = "0 00 00 * * *", zone = "Asia/Seoul") // 매일 00시 00분 00초
    public void scheduledEvent() {
        userRepository.updateIsCheck();
    }


}
