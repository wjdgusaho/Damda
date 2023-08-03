package com.b210.damda.domain.dto.weather;

import lombok.*;

/**
 * mode : true일 경우 위경도->GRID변환
 * false일 경우 반대
 */
@Data
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class WeatherDTO {
    boolean mode;
    double lat;
    double lan;
    double nx;
    double ny;
}
