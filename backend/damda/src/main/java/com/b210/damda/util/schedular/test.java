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
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

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

        // 서버 시스템 시간 가져오기
        LocalDateTime serverTime = LocalDateTime.now();

        // 서버 시스템 시간을 Asia/Seoul 기준 시간으로 변환
        ZonedDateTime seoulTime = serverTime.atZone(ZoneId.of("Asia/Seoul"));

        // 서울 시간을 원하는 형식으로 출력
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String formattedSeoulTime = seoulTime.format(formatter);

        log.info("현재 서울 시간: " + formattedSeoulTime);
    }

//    //서울시간 00시마다 timecapsule_mapping 테이블에 card_able 컬럼들이 모두 (true 또는 1)로 수정되게 변경
//    @Scheduled(cron = "0 00 00 * * *", zone = "Asia/Seoul") // 매일 00시 00분 00초
//    public void scheduledEvent() {
//        timecapsuleRepository.cardAble(true, true);
//    }

}
