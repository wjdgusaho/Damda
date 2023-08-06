package com.b210.damda.util.serverSentEvent.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 *  EventService의 원활한 구현을 위한 부가 메서드 집합
 */
@Service
@Slf4j
public class AddOnEventService {

    //Find NowUser
    public Long getUserNo(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        Long userNo = (Long) principal;

        return userNo;
    }

    //Event Builder
    public ServerSentEvent<String> buildServerSentEvent(String eventName, String data) {
        return ServerSentEvent.<String>builder()
                .id(data.toString())
                .event(eventName)
                .data(data)
                .build();
    }

    //Time Sender
    public String getNowTime() {
        LocalDateTime currentDateTime = LocalDateTime.now(); //현재 시간
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yy년 MM월 dd일");
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH시 mm분");
        return "[ " + currentDateTime.format(dateFormatter) + ", " + currentDateTime.format(timeFormatter) + " ]";
    }


}
