package com.b210.damda.domain.shop.service;

import com.b210.damda.domain.dto.ThemaMappingDTO;
import com.b210.damda.domain.dto.ThemaShopDTO;
import com.b210.damda.domain.entity.Thema;
import com.b210.damda.domain.entity.ThemaMapping;
import com.b210.damda.domain.shop.repository.ThemaMappingRepository;
import com.b210.damda.domain.shop.repository.ThemaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Service
public class ShopServiceImpl implements ShopService{

    private final ThemaRepository themaRepository;
    private final ThemaMappingRepository themaMappingRepository;
    @Override
    public List<ThemaShopDTO> getThemaList(Long userNo) throws Exception {
        List<ThemaShopDTO> themaList = getThemList();
        List<ThemaMappingDTO> themaMappingList = getThemMappingList(userNo);


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
        List<ThemaMapping> myThema = themaMappingRepository.findByUserNo(userNo);

        List<ThemaMappingDTO> myThemaList = new ArrayList<>();
        for(ThemaMapping themM : myThema){
            myThemaList.add(themM.tothemaMappingDTO());
        }
        return myThemaList;
    }


}
