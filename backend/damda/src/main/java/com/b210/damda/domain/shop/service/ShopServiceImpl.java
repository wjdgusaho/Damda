package com.b210.damda.domain.shop.service;

import com.b210.damda.domain.dto.ItemsMappingDTO;
import com.b210.damda.domain.dto.ItemsShopDTO;
import com.b210.damda.domain.dto.ThemaMappingDTO;
import com.b210.damda.domain.dto.ThemaShopDTO;
import com.b210.damda.domain.entity.Items;
import com.b210.damda.domain.entity.ItemsMapping;
import com.b210.damda.domain.entity.Thema;
import com.b210.damda.domain.entity.ThemaMapping;
import com.b210.damda.domain.shop.repository.ItemsMappingRepository;
import com.b210.damda.domain.shop.repository.ItemsRepository;
import com.b210.damda.domain.shop.repository.ThemaMappingRepository;
import com.b210.damda.domain.shop.repository.ThemaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
@Slf4j
public class ShopServiceImpl implements ShopService{

    private final ThemaRepository themaRepository;
    private final ThemaMappingRepository themaMappingRepository;
    private final ItemsRepository itemsRepository;
    private final ItemsMappingRepository itemsMappingRepository;
    
    /*
        테마 보유중, 미보유중 내보내기
     */
    @Override
    public List<ThemaShopDTO> getThemaList(Long userNo) throws Exception {
        List<ThemaShopDTO> themaList = getThemList();
        List<ThemaMappingDTO> themaMappingList = getThemMappingList(userNo);

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
    @Override
    public List<ThemaShopDTO> getThemList() throws Exception {
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
    @Override
    public List<ThemaMappingDTO> getThemMappingList(Long userNo) throws Exception {
        List<ThemaMapping> myThema = themaMappingRepository.findByUserUserNo(userNo);

        List<ThemaMappingDTO> myThemaList = new ArrayList<>();
        for(ThemaMapping themM : myThema){
            myThemaList.add(themM.tothemaMappingDTO());
        }
        return myThemaList;
    }

    @Override
    public Map<String, Object> getItemList(Long userNo) throws Exception {
        List<ItemsShopDTO> allItemList = getItemList();
        List<ItemsMappingDTO> ItemMappingList = getItemsMappginList(userNo);

        Set<Long> itemMappginNumbers = ItemMappingList.stream()
                .map(ItemsMappingDTO::getItemNo)
                .collect(Collectors.toSet());

        List<ItemsShopDTO> decoItemList = new ArrayList<>();
        List<ItemsShopDTO> capsuleItemList = new ArrayList<>();

        for(ItemsShopDTO itemShop : allItemList){
            if(itemMappginNumbers.contains(itemShop.getItemNo())){
                itemShop.setUserHave(true);
            }
            if(itemShop.getType().equals("DECO")){
                decoItemList.add(itemShop);
            }
            else if(itemShop.getType().equals("CAPSULE")){
                capsuleItemList.add(itemShop);
            }
        }

        Map<String, Object> items = new HashMap<>();
        items.put("decoItemList", decoItemList);
        items.put("capsuleItemList", capsuleItemList);

        return items;
    }

    /*
        유저 아이템 받아오기
     */
    @Override
    public List<ItemsMappingDTO> getItemsMappginList(Long userNo) throws Exception {
        List<ItemsMapping> itemsMapping = itemsMappingRepository.findByUserUserNo(userNo);

        List<ItemsMappingDTO> itemsMappingList = new ArrayList<>();
        for(ItemsMapping mapping : itemsMapping){
            itemsMappingList.add(mapping.tothemaMappingDTO());
        }
        return itemsMappingList;
    }

    /*
        전체 아이템 리스트 받아오기
     */
    @Override
    public List<ItemsShopDTO> getItemList() throws Exception {
        List<Items> items = itemsRepository.findAll();

        List<ItemsShopDTO> itemsList = new ArrayList<>();
        for(Items item: items){
            itemsList.add(item.toItemShopDTO());
        }
        return itemsList;
    }


}
