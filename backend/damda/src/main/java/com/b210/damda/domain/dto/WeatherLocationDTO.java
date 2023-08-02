package com.b210.damda.domain.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class WeatherLocationDTO {

    long id;
    String localBig;
    String localMedium;
    String localSmall;


}
