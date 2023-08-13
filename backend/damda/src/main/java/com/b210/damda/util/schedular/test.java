package com.b210.damda.util.schedular;

import com.b210.damda.domain.timecapsule.repository.TimeCapsuleSEERepository;
import com.b210.damda.util.serverSentEvent.service.AddOnEventService;
import com.b210.damda.util.serverSentEvent.service.EventStreamService;
import com.b210.damda.util.serverSentEvent.service.FriendEventService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class test {

    final FriendEventService friendEventService;
    final EventStreamService eventStreamService;
    final AddOnEventService addOnEventService;
    final TimeCapsuleSEERepository timeCapsuleSEERepository;
    @Scheduled(fixedRate = 3000) // 테스터
    public void test() {
        log.info("테스터 스케줄러 동작");
//        friendEventService.checkAllFriendEvent();
        System.out.println(timeCapsuleSEERepository.getUserNoByInviteCode("CH8OX4YNTO"));
    }

}
