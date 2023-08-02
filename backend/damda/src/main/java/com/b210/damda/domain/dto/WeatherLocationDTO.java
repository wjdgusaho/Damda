package com.b210.damda.domain.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class WeatherLocationDTO {
    String localBig;
    String localMedium;
}
