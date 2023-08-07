package com.b210.damda.domain.dto.weather;

import lombok.*;

/**
 * mode : true일 경우 위경도->GRID변환
 * false일 경우 반대
 */
@Data
@NoArgsConstructor  // 기본 생성자 추가
@AllArgsConstructor
public class WeatherLocationDTO {
    boolean mode = true;
    double lat;
    double lan;
    double nx;
    double ny;
}
