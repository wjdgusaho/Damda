package com.b210.damda.util.schedular;

import com.b210.damda.domain.entity.Timecapsule.Timecapsule;
import com.b210.damda.domain.timecapsule.repository.TimeCapsuleSEERepository;
import com.b210.damda.domain.timecapsule.repository.TimeCapsuleSchedularRepository;
import com.b210.damda.domain.user.repository.UserRepository;
import com.b210.damda.util.serverSentEvent.service.AddOnEventService;
import com.b210.damda.util.serverSentEvent.service.EventStreamService;
import com.b210.damda.util.serverSentEvent.service.FriendEventService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class test {

    final FriendEventService friendEventService;
    final EventStreamService eventStreamService;
    final AddOnEventService addOnEventService;
    final TimeCapsuleSEERepository timeCapsuleSEERepository;
    final TimeCapsuleSchedularRepository timeCapsuleSchedularRepository;

//    @Scheduled(fixedRate = 3000) // 테스터
//    public void test() {
//        log.info("테스터 스케줄러 동작");
//;
//        // 서버 시스템 시간 가져오기, 임시로 -7일해서 만료 시간 체크하였음.
//        LocalDateTime serverTime = LocalDateTime.now().plusHours(9).minusDays(7);
//
//        List<Timecapsule> timecapsules = timeCapsuleSchedularRepository.getExpiredTimeCapsule(Timestamp.valueOf(serverTime));
//        for(Timecapsule t : timecapsules) {
//            List<Long> timeCapsuleUserNo = timeCapsuleSchedularRepository.getUserNoByTimeCapsuleNo(t.getTimecapsuleNo());
//            //해당 타임캡슐의 유저 no 뽑아왔음
//
//
//            for (int i = 0; i < timeCapsuleUserNo.size(); i++) {
//                System.out.print(timeCapsuleUserNo.get(i) + " "); //뽑아낸 유저no
//            }
//        }
//    }





}
