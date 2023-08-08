package com.b210.damda.util.weatherAPI.service;

import com.b210.damda.domain.dto.weather.WeatherLocationDTO;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;
import reactor.core.publisher.Mono;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

/**
 * 기상청 데이터 API 연동
 * 현재 지역의 날씨 현황 수집
 */
@Service
@Slf4j
@Setter
public class WeatherAPIServiceImpl implements WeatherAPIService {
    private final WebClient WEBCLIENT;

    @Value("${weather.apikey}")
    private String serviceKey;

    public WeatherAPIServiceImpl() {
        this.WEBCLIENT = WebClient.create();
    }

    @Override
    public String getNowWeatherInfos(WeatherLocationDTO weatherDTO) throws Exception {
        //URL Encoding Issue로 인한 문자열 대체
//        String EncodeServiceKey = serviceKey.replace("+", "%2B");
        String EncodeServiceKey = URLEncoder.encode(serviceKey, StandardCharsets.UTF_8.toString());

        String baseUrl = "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst";
        String pageNo = "1";
        String numOfRows = "10";
        String dataType = "JSON";

        /*
        Static Class를 통한 위경도 -> GRID 변환.
        현재 기상청 API는 위경도값을 입력 파라미터로 받지 않음.
        따라서 GRID 격자 변환값인 nx, ny로 치환하였음.
         */
        LatXLngY latXLngY = ConvertGRID_GPS.converting(weatherDTO.isMode(), weatherDTO.getLat(), weatherDTO.getLan());
        String nx = Integer.toString((int)latXLngY.x);
        String ny = Integer.toString((int)latXLngY.y);

        //현재 시간의 1시간 전 날짜를 API 입력 포맷으로 변환
        String baseTime = LocalTime
                .now()
                .minusHours(1)
                .format(DateTimeFormatter.ofPattern("HHmm"));

        LocalDateTime tempBaseDate = LocalDateTime.now();
        if(baseTime.equals("2300")) {
            tempBaseDate = tempBaseDate.minusDays(1);
        }
        String baseDate = tempBaseDate.format(DateTimeFormatter.ofPattern("yyyyMMdd"));

        //요소들 조합하여 최종 요청 URL 작성
        URI mainUrl = UriComponentsBuilder.fromHttpUrl(baseUrl)
                .queryParam("serviceKey", EncodeServiceKey)
                .queryParam("pageNo", pageNo)
                .queryParam("numOfRows", numOfRows)
                .queryParam("dataType", dataType)
                .queryParam("base_date", baseDate)
                .queryParam("base_time", baseTime)
                .queryParam("nx", nx)
                .queryParam("ny", ny)
                .build(true).toUri();

        Mono<String> response = WEBCLIENT.get()
                .uri(mainUrl)
                .retrieve()
                .bodyToMono(String.class)
                .doOnError(error -> log.info("Error occurred: {}", error.getMessage()));

        log.info("현재 좌표 날씨 받아오는 중 . . . : {}", mainUrl);

        return convertWeatherDTO(response);
    }

    /**
     * 기상청 API에서 받아온 값을 block하고,
     * 현재 필요한 비/눈 타입만 변환하여 동기적으로 전송
     */
    @Override
    public String convertWeatherDTO(Mono<String> response) throws JsonProcessingException {
        // JSON 문자열을 JSON 객체로 파싱, response.block()을 통해 결과값이 나올때까지 대기
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(response.block());

        // "item" 부분 추출
        JsonNode items = jsonNode.get("response")
                .get("body")
                .get("items")
                .get("item");

        // "category" 값이 "PTY"인 첫 번째 요소 추출
        JsonNode ptyItem = null;
        for (JsonNode item : items) {
            JsonNode categoryNode = item.get("category");
            if (categoryNode != null && categoryNode.asText().equals("PTY")) {
                ptyItem = item;
                break; // 첫 번째 해당 요소를 찾으면 루프 종료
            }
        }

        //PTY의 obsrvalue 추출
        JsonNode resultJson = ptyItem.get("obsrValue");
        int result = resultJson.asInt();
        if(result == 1 || result == 5 || result == 4) {
            return "RAIN";
        }
        else if(result == 3 || result == 7) {
            return "SNOW";
        }
        else if(result == 2 || result == 6) {
            return "SNOWRAIN";
        }
        else {
            return "SUN";
        }

    }


}
