package com.b210.damda.domain.shop.service;

import com.b210.damda.domain.dto.ThemaMappingDTO;
import com.b210.damda.domain.dto.ThemaShopDTO;
import com.b210.damda.domain.entity.Thema;
import com.b210.damda.domain.entity.ThemaMapping;
import com.b210.damda.domain.shop.repository.ThemaMappingRepository;
import com.b210.damda.domain.shop.repository.ThemaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
@Slf4j
public class ShopServiceImpl implements ShopService{

    private final ThemaRepository themaRepository;
    private final ThemaMappingRepository themaMappingRepository;
    @Override
    public List<ThemaShopDTO> getThemaList(Long userNo) throws Exception {
        List<ThemaShopDTO> themaList = getThemList();
        List<ThemaMappingDTO> themaMappingList = getThemMappingList(userNo);
        log.info(themaList.toString());
        log.info(themaMappingList.toString());
        // HashSet으로 변경 (검색 속도 증가를 위함)
        Set<Long> themaMappingNumbers = themaMappingList.stream()
                .map(ThemaMappingDTO::getTemaNo)
                .collect(Collectors.toSet());

        for(ThemaShopDTO themaShop : themaList){
            if(themaMappingNumbers.contains(themaShop.getThemaNo())){
                themaShop.setUserHave(true);
            }
        }

        return themaList;
    }

    /*
        테마 전체 리스트 가져오기
     */
    public List<ThemaShopDTO> getThemList(){
        List<Thema> themaList = themaRepository.findAll();

        List<ThemaShopDTO> themaShopList = new ArrayList<>();
        for(Thema thema: themaList){
            themaShopList.add(thema.toThemaShopDTO());
        }
        return themaShopList;
    }

    /*
        유저가 구입한 테마 리스트 가져오기
     */
    public List<ThemaMappingDTO> getThemMappingList(Long userNo){
        List<ThemaMapping> myThema = themaMappingRepository.findByUserUserNo(userNo);

        List<ThemaMappingDTO> myThemaList = new ArrayList<>();
        for(ThemaMapping themM : myThema){
            myThemaList.add(themM.tothemaMappingDTO());
        }
        return myThemaList;
    }


}
