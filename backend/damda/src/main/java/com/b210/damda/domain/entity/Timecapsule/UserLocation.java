package com.b210.damda.domain.entity.Timecapsule;

import com.b210.damda.domain.entity.User.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Getter
public class UserLocation {

    @Id  @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userLocationNo;

    @Column(name = "local_big")
    private String localBig;

    @Column(name = "local_medium")
    private String localMedium;

    @ManyToOne
    @JoinColumn(name = "user_no")
    private User user;

    private Timestamp weatherTime;

    private String weather;

    public UserLocation(){
    }

    public void CreateUserLocation(User user, String localBig, String localMedium, Timestamp weatherTime){
        this.user = user;
        this.localBig = localBig;
        this.localMedium = localMedium;
        this.weatherTime = weatherTime;
    }

    public void UpdateWeatherTime(Timestamp weatherTime){
        this.weatherTime = weatherTime;
    }

    public void UpdateWeather(String weather){
        this.weather = weather;
    }

    public void UpdateLocalMedium(String localMedium) {this.localMedium = localMedium; }

    public void UpdateLoclaBig(String localBig) { this.localBig = localBig; }

}
