package com.b210.damda.domain.dto;

import lombok.Data;

/**
 * mode : true일 경우 위경도->GRID변환
 * false일 경우 반대
 */
@Data
public class WeatherDTO {
    boolean mode;
    double lat;
    double lan;
    int nx;
    int ny;
}
