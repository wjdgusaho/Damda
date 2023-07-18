package com.b210.damda.util.weatherAPI.service;

import com.b210.damda.domain.dto.WeatherDTO;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

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
    public Mono<String> getNowWeatherInfos(WeatherDTO weatherDTO) throws Exception {
        //URL Encoding Issue로 인한 문자열 대체
        String EncodeServiceKey = serviceKey.replace("+", "%2B");

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
