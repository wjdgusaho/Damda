package com.b210.damda.domain.entity.weather;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@NoArgsConstructor
@Entity(name = "weather_location_info")
public class WeatherLocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "weather_location_info_no")
    private long id;

    @Column(name = "local_big")
    private String localBig;

    @Column(name = "local_medium")
    private String localMedium;

    @Column(name = "local_small")
    private String localSmall;

    @Column
    private int nx;

    @Column
    private int ny;

    @Column
    private double lan;

    @Column
    private double lat;



}
