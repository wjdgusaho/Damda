package com.b210.damda.util.schedular.service;


import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class ScheduledService {
    @Scheduled(fixedRate = 10000) // 10초마다 실행
    public void scheduledTask() {
        log.info("스케줄링된 작업 실행: {}", System.currentTimeMillis());
    }
}
