package com.b210.damda.domain.entity.weather;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity(name="weather_location_list")
public class WeatherLocationList {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "weather_location_list_no")
    private long id;

    @Column(name = "local_big")
    private String localBig;

    @Column(name = "local_medium")
    private String localMedium;
}
