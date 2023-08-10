package com.b210.damda.util.serverSentEvent.service;

import com.b210.damda.domain.dto.serverSentEvent.ServerSentEventDTO;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

/**
 *  EventService의 원활한 구현을 위한 부가 메서드 집합
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AddOnEventService {

    private final ObjectMapper objectMapper;

    //Find NowUser
    public Long getUserNo(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        Long userNo = (Long) principal;

        return userNo;
    }


    //Event Builder(DTO)
    public ServerSentEvent<JsonNode> buildServerSentEvent(String eventName, ServerSentEventDTO data) {
        JsonNode jsonData = objectMapper.valueToTree(data); //json 타입으로 변환
        return ServerSentEvent.<JsonNode>builder()
                .id(data.toString())
                .event(eventName)
                .data(jsonData)
                .build();
    }

    //Time Sender
    public String getNowTime(LocalDateTime dateTime) {
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yy년 MM월 dd일");
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH시 mm분");
        return "[ " + dateTime.format(dateFormatter) + ", " + dateTime.format(timeFormatter) + " ]";
    }


}
