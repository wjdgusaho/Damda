package com.b210.damda.domain.dto;

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
    int nx;
    int ny;
    String content;

    @Builder
    public WeatherDTO(double lat, double lan, int nx, int ny, String content) {
        this.lan = lan;
        this.lat = lat;
        this.nx = nx;
        this.ny = ny;
        this.content = content;
    }
}
