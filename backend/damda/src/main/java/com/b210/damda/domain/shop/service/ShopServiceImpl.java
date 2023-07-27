package com.b210.damda.domain.shop.service;

import com.b210.damda.domain.dto.ItemsMappingDTO;
import com.b210.damda.domain.dto.ItemsShopDTO;
import com.b210.damda.domain.dto.ThemaMappingDTO;
import com.b210.damda.domain.dto.ThemaShopDTO;
import com.b210.damda.domain.entity.*;
import com.b210.damda.domain.shop.repository.ItemsMappingRepository;
import com.b210.damda.domain.shop.repository.ItemsRepository;
import com.b210.damda.domain.shop.repository.ThemaMappingRepository;
import com.b210.damda.domain.shop.repository.ThemaRepository;
import com.b210.damda.domain.user.repository.UserRepository;
import com.b210.damda.util.exception.CommonException;
import com.b210.damda.util.exception.CustomExceptionStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;

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
    private final UserRepository userRepository;
    
    /*
        테마 보유중, 미보유중 내보내기
     */
    @Override
    public List<ThemaShopDTO> getThemaList(Long userNo) {
        List<ThemaShopDTO> themaList = getThemAllList();
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
    public List<ThemaShopDTO> getThemAllList() {
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
    public List<ThemaMappingDTO> getThemMappingList(Long userNo) {
        List<ThemaMapping> myThema = themaMappingRepository.findByUserUserNo(userNo);

        List<ThemaMappingDTO> myThemaList = new ArrayList<>();
        for(ThemaMapping themM : myThema){
            myThemaList.add(themM.tothemaMappingDTO());
        }
        return myThemaList;
    }

    @Override
    public Map<String, Object> getItemList(Long userNo) {
        List<ItemsShopDTO> allItemList = getItemAllList();
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
    public List<ItemsMappingDTO> getItemsMappginList(Long userNo) {
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
    public List<ItemsShopDTO> getItemAllList() {
        List<Items> items = itemsRepository.findAll();

        List<ItemsShopDTO> itemsList = new ArrayList<>();
        for(Items item: items){
            itemsList.add(item.toItemShopDTO());
        }
        return itemsList;
    }

    /*
        테마 아이템 구매하기
     */
    @Override
    public Map<String, Object> buyThema(Long userNo, Long themaNo) {

        User user = userRepository.findByUserNo(userNo);
        
        // 해당 아이템이 있는지 조건 확인
        Thema thema = themaRepository.findByThemaNo(themaNo)
                .orElseThrow(() -> new CommonException(CustomExceptionStatus.THEMA_NOT_FOUND));

        // 골드 부족 검증 로직
        if(thema.getPrice() > user.getCoin()){
            throw new CommonException(CustomExceptionStatus.USER_NOT_ENOUGH_COIN);
        }

        // 중복 구매 검증 로직 - ifPresent 조회된 데이터가 있는경우 실행
        themaMappingRepository.findByUserUserNoAndThemaThemaNo(userNo, themaNo).ifPresent(i -> {
            throw new CommonException(CustomExceptionStatus.THEMA_DUPLICATE);
        });

        // 유저 골드 소모
        user.setCoin(user.getCoin() - thema.getPrice());

        // 유저 - 구매한아이템 매핑
        ThemaMapping buyThema = new ThemaMapping();
        buyThema.setThema(thema);
        buyThema.setUser(user);
        themaMappingRepository.save(buyThema);
        
        // 전체 리스트 반환 (보유중 미보유중)
        List<ThemaShopDTO> themaList = getThemaList(userNo);

        Map<String, Object> result = new HashMap<>();
        result.put("themaList", themaList);
        result.put("userInfo", user.toUserDTO());

        return result;
    }
    
    /*
        스티커 아이템 구매하기
     */
    @Override
    public Map<String, Object> buySticker(Long userNo, Long itemNo) {

        User user = userRepository.findByUserNo(userNo);
        
        // 해당 아이템이 있는지 조건 확인
        Items items = itemsRepository.findByItemNo(itemNo)
                .orElseThrow(() -> new CommonException(CustomExceptionStatus.ITEM_NOT_FOUND));

        // 해당 아이템이 스티커가 맞는지 확인
        if(!items.getType().equals("DECO")){
            throw new CommonException(CustomExceptionStatus.ITEM_NOT_STICKER);
        }

        // 골드 부족 확인
        if(items.getPrice() > user.getCoin()){
            throw new CommonException(CustomExceptionStatus.USER_NOT_ENOUGH_COIN);
        }

        // 스티커 중복 구매 확인 로직
        itemsMappingRepository.findByUserUserNoAndItemsItemNo(userNo, itemNo).ifPresent(i -> {
            throw new CommonException(CustomExceptionStatus.STICKER_DUPLICATE);
        });

        // 유저 코인 소모
        user.setCoin(user.getCoin() - items.getPrice());

        // 유저 구매한 아이템 매핑
        ItemsMapping itemMapping = new ItemsMapping();
        itemMapping.setItems(items);
        itemMapping.setUser(user);
        itemsMappingRepository.save(itemMapping);

        //전체 아이템 리스트 반환
        Map<String, Object> itemList = getItemList(userNo);

        //필요한 데이터만 전달
        Map<String, Object> result = new HashMap<>();
        result.put("decoItemList", itemList.get("decoItemList"));
        result.put("userInfo", user.toUserDTO());

        return result;
    }


}
