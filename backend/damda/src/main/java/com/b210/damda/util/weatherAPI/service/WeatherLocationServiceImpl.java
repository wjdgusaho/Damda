package com.b210.damda.util.weatherAPI.service;

import com.b210.damda.domain.dto.weather.WeatherDTO;
import com.b210.damda.domain.dto.weather.WeatherLocationDTO;
import com.b210.damda.domain.entity.weather.WeatherLocation;
import com.b210.damda.domain.entity.weather.WeatherLocationList;
import com.b210.damda.util.weatherAPI.repository.WeatherLocationListRepository;
import com.b210.damda.util.weatherAPI.repository.WeatherLocationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class WeatherLocationServiceImpl implements WeatherLocationService {

    private final WeatherLocationRepository weatherLocationRepository;
    private final WeatherLocationListRepository weatherLocationListRepository;
    @Override
    public WeatherLocationDTO getNowLocation(WeatherDTO weatherDTO) throws Exception {

        //DTO에서 위경도값과 변환 모드 넣고 변환하는 클래스에 돌린 뒤, LatXLngY 인스턴스에 값 대입
        double lat = weatherDTO.getLat();
        double lan = weatherDTO.getLan();
        LatXLngY latXLngY = ConvertGRID_GPS.converting(weatherDTO.isMode(), lat, lan);

        //격자값 변환한 nx,ny와 동일한 값 찾고, 이 중 위경도와 가장 유사한 값을 찾음
        List<WeatherLocation> weatherLocations = weatherLocationRepository.findByNxAndNy((int)latXLngY.x, (int)latXLngY.y);

        for (int i = 0; i < weatherLocations.size(); i++) {
            WeatherLocation now = weatherLocations.get(i);
            //현재좌표와 같은 격자값들을 가진 장소들의 좌표값 차이를 비교
            double nowVal = Math.abs(lat - now.getLat()) + Math.abs(lan - now.getLan());
            if(DistVal.maxVal >= nowVal) {
                DistVal.maxVal = nowVal;
                DistVal.result = now;
            }
        }

        //최종 가장 근접한 지역의 결과값을 WeatherDTO 형태로 반출
        WeatherLocationDTO result = WeatherLocationDTO.builder()
                .localBig(DistVal.result.getLocalBig())
                .localMedium(DistVal.result.getLocalMedium())
                .build();

        return result;
    }

    @Override
    public List<String> getBigLocations() throws Exception {
        List<WeatherLocationList> nowValues = weatherLocationListRepository.findAll();
        HashSet<String> result = new HashSet<>();

        for (WeatherLocationList nowValue : nowValues ) {
            result.add(nowValue.getLocalBig());
        }
        return new ArrayList<>(result);
    }
    @Override
    public List<String> getMediumLocations(String local_big) throws Exception {
        List<WeatherLocationList> getValues = weatherLocationListRepository.findAllByLocalBig(local_big);
        List<String> result = new ArrayList<>();
        for (WeatherLocationList now : getValues) {
            result.add(now.getLocalMedium());
        }
        return result;
    }

}

class DistVal {
    static double maxVal = Double.MAX_VALUE;
    static WeatherLocation result = new WeatherLocation();
}