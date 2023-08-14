package com.b210.damda.util.serverSentEvent.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * 타임캡슐 이벤트와 관련된 서비스입니다.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class TimeCapsuleEventService {
    private final EventStreamService eventStreamService; //실제 스트림을 보내는 객체
    private final AddOnEventService addOnEventService;   //공통 로직에서 사용되는 이벤트 메서드


}
