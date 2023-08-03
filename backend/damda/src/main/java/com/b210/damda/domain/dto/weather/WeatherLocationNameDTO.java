package com.b210.damda.domain.dto.weather;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor  // 기본 생성자 추가
@AllArgsConstructor
public class WeatherLocationNameDTO {
    String localBig;
    String localMedium;
}
