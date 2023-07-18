package com.b210.damda.util.weatherAPI.service;

import com.b210.damda.domain.dto.WeatherDTO;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * 기상청 데이터 :
 * 현재 지역의 날씨 현황
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
    public Mono<String> getNowWeatherInfos(double lat, double lan) throws Exception {
        //해당 class가 static class이기 때문에 인스턴스 객체 생성할 필요가 없음
        LatXLngY latXLngY = ConvertGRID_GPS.converting(true, 37.309894444444, 127.644311111111);

        String baseUrl = "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst";
        String pageNo = "1";
        String numOfRows = "10";
        String dataType = "JSON";
        String baseDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String baseTime = LocalTime.now().format(DateTimeFormatter.ofPattern("HHmm"));
        String nx = Integer.toString((int)latXLngY.x);
        String ny = Integer.toString((int)latXLngY.y);

        //URL Encoding Issue로 인한 문자열 대체
        String EncodeServiceKey = serviceKey.replace("+", "%2B");

        //요소들 조합하여 최종 요청 URL 작성
        String mainUrl = UriComponentsBuilder.fromHttpUrl(baseUrl)
                .queryParam("serviceKey", EncodeServiceKey)
                .queryParam("pageNo", pageNo)
                .queryParam("numOfRows", numOfRows)
                .queryParam("dataType", dataType)
                .queryParam("base_date", baseDate)
                .queryParam("base_time", baseTime)
                .queryParam("nx", nx)
                .queryParam("ny", ny)
                .build().toUriString();

        Mono<String> response = WEBCLIENT.get()
                .uri(mainUrl)
                .retrieve()
                .bodyToMono(String.class)
                .doOnError(error -> log.info("Error occurred: {}", error.getMessage()));

        log.info("res Url : {}", mainUrl);

        return response;
    }
}
