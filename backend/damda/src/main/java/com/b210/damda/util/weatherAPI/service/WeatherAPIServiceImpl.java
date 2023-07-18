package com.b210.damda.util.weatherAPI.service;

import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;
import reactor.core.publisher.Mono;

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

    //위도 경도 관련 변수
    private float lan;
    private float lat;

    public WeatherAPIServiceImpl() {
        this.WEBCLIENT = WebClient.create();
    }

    @Override
    public List<Float> getWeatherInfos(@RequestBody List<Float> data) throws Exception {
        //일단 확인용으로 하드코딩 해놨음
        String baseUrl = "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst";
        String pageNo = "1";
        String numOfRows = "10";
        String dataType = "JSON";
        String baseDate = "20230717";
        String baseTime = "0630";
        lan = 55;
        lat = 127;

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
                .queryParam("nx", Float.toString(lan))
                .queryParam("ny", Float.toString(lat))
                .build().toUriString();


        Mono<String> response = WEBCLIENT.get()
                .uri(mainUrl)
                .retrieve()
                .bodyToMono(String.class)
                .doOnError(error -> log.info("Error occurred: {}", error.getMessage()));
        log.info("res Url : {}", mainUrl);
        log.info("json : {}", response);
        //지금 float가 안 받아지는 것 같음(좌표)

        //https://data.kma.go.kr/data/rmt/rmtList.do?code=400&pgmNo=570
        return null;
    }
}
