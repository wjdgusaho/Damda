package com.b210.damda.domain.shop.service;

import com.b210.damda.domain.dto.*;
import com.b210.damda.domain.entity.*;
import com.b210.damda.domain.shop.repository.*;
import com.b210.damda.domain.dto.Timecapsule.TimecapsuleShopDTO;
import com.b210.damda.domain.entity.Timecapsule.Timecapsule;
import com.b210.damda.domain.entity.Timecapsule.TimecapsuleMapping;
import com.b210.damda.domain.timecapsule.repository.TimecapsuleMappingRepository;
import com.b210.damda.domain.timecapsule.repository.TimecapsuleRepository;
import com.b210.damda.domain.user.repository.UserRepository;
import com.b210.damda.util.exception.CommonException;
import com.b210.damda.util.exception.CustomExceptionStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
@Slf4j
public class ShopServiceImpl implements ShopService{

    private final ThemeRepository themeRepository;
    private final ThemeMappingRepository themeMappingRepository;
    private final ItemsRepository itemsRepository;
    private final ItemsMappingRepository itemsMappingRepository;
    private final UserRepository userRepository;
    private final TimecapsuleRepository timecapsuleRepository;
    private final TimecapsuleMappingRepository timecapsuleMappingRepository;

    // 타임캡슐 최대로 살수있는 개수
    private final int MAX_CAPSULE_LIMIT = 10;
    //타임캡슐 최대 용량
    private final int MAX_FILE_SIZE = 1000;

    //증가될 파일의 사이즈 (구매시)
    private final int UP_FILE_SIZE = 100;

    /*
        유저정보 불러오기
     */
    public Long getUserNo(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        Long userNo = (Long) principal;

        return userNo;
    }


    /*
        테마 보유중, 미보유중 내보내기
     */
    @Override
    public List<ThemeShopDTO> getThemeList() {

        List<ThemeShopDTO> themeList = getThemAllList();
        List<ThemeMappingDTO> themeMappingList = getThemMappingList();

        // HashSet으로 변경 (검색 속도 증가를 위함)
        Set<Long> themeMappingNumbers = themeMappingList.stream()
                .map(ThemeMappingDTO::getTemaNo)
                .collect(Collectors.toSet());

        for(ThemeShopDTO themeShop : themeList){
            if(themeMappingNumbers.contains(themeShop.getThemeNo())){
                themeShop.setUserHave(true);
            }
        }
        return themeList;
    }

    /*
        테마 전체 리스트 가져오기
     */
    @Override
    public List<ThemeShopDTO> getThemAllList() {
        List<Theme> themeList = themeRepository.findAll();

        List<ThemeShopDTO> themeShopList = new ArrayList<>();
        for(Theme theme: themeList){
            themeShopList.add(theme.toThemeShopDTO());
        }
        return themeShopList;
    }

    /*
        유저가 구입한 테마 리스트 가져오기
     */
    @Override
    public List<ThemeMappingDTO> getThemMappingList() {

        Long userNo = getUserNo();

        List<ThemeMapping> myTheme = themeMappingRepository.findByUserUserNo(userNo);

        List<ThemeMappingDTO> myThemeList = new ArrayList<>();
        for(ThemeMapping themM : myTheme){
            myThemeList.add(themM.tothemeMappingDTO());
        }
        return myThemeList;
    }

    /*
        아이템 리스트 받아오기 deco랑 캡슐 나누기
     */
    @Override
    public Map<String, Object> getItemList() {

        List<ItemsShopDTO> allItemList = getItemAllList();
        List<ItemsMappingDTO> ItemMappingList = getItemsMappginList();

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
            else {
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
    public List<ItemsMappingDTO> getItemsMappginList() {

        Long userNo = getUserNo();

        List<ItemsMapping> itemsMapping = itemsMappingRepository.findByUserUserNo(userNo);

        List<ItemsMappingDTO> itemsMappingList = new ArrayList<>();
        for(ItemsMapping mapping : itemsMapping){
            itemsMappingList.add(mapping.tothemeMappingDTO());
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
    public Map<String, Object> buyTheme(Long themeNo) {
        Long userNo = getUserNo();

        User user = userRepository.findByUserNo(userNo).orElseThrow(
                () -> new CommonException(CustomExceptionStatus.NOT_USER));
        
        // 해당 아이템이 있는지 조건 확인
        Theme theme = themeRepository.findByThemeNo(themeNo)
                .orElseThrow(() -> new CommonException(CustomExceptionStatus.THEMA_NOT_FOUND));

        // 골드 부족 검증 로직
        if(theme.getPrice() > user.getCoin()){
            throw new CommonException(CustomExceptionStatus.USER_NOT_ENOUGH_COIN);
        }

        // 중복 구매 검증 로직 - ifPresent 조회된 데이터가 있는경우 실행
        themeMappingRepository.findByUserUserNoAndThemeThemeNo(userNo, themeNo).ifPresent(i -> {
            throw new CommonException(CustomExceptionStatus.THEME_DUPLICATE);
        });

        // 유저 골드 소모
        user.setCoin(user.getCoin() - theme.getPrice());
        userRepository.save(user);

        // 유저 - 구매한아이템 매핑
        ThemeMapping buyTheme = new ThemeMapping();
        buyTheme.setTheme(theme);
        buyTheme.setUser(user);
        themeMappingRepository.save(buyTheme);
        
        // 전체 리스트 반환 (보유중 미보유중)
        List<ThemeShopDTO> themeList = getThemeList();

        Map<String, Object> result = new HashMap<>();
        result.put("themeList", themeList);
        result.put("userInfo", user.toUserDTO());

        return result;
    }
    
    /*
        스티커 아이템 구매하기
     */
    @Override
    public Map<String, Object> buySticker(Long itemNo) {
        Long userNo = getUserNo();
        User user = userRepository.findByUserNo(userNo).orElseThrow(
                () -> new CommonException(CustomExceptionStatus.NOT_USER));
        
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
        userRepository.save(user);

        // 유저 구매한 아이템 매핑
        ItemsMapping itemMapping = new ItemsMapping();
        itemMapping.setItems(items);
        itemMapping.setUser(user);
        itemsMappingRepository.save(itemMapping);

        //전체 아이템 리스트 반환
        Map<String, Object> itemList = getItemList();

        //필요한 데이터만 전달
        Map<String, Object> result = new HashMap<>();
        result.put("decoItemList", itemList.get("decoItemList"));
        result.put("userInfo", user.toUserDTO());

        return result;
    }

    /*
        타임 캡슐 최대 개수 증가 아이템 구매
     */
    @Override
    public Map<String, Object> buyCapsuleLimit(Long itemNo) {
        Long userNo = getUserNo();
        User user = userRepository.findByUserNo(userNo).orElseThrow(
                () -> new CommonException(CustomExceptionStatus.NOT_USER));

        // 해당 아이템이 있는지 조건 확인
        Items items = itemsRepository.findByItemNo(itemNo)
                .orElseThrow(() -> new CommonException(CustomExceptionStatus.ITEM_NOT_FOUND));

        // 해당 아이템이 캡슐증가 아이템이 맞는지 확인
        if(!items.getType().equals("CAPSULE")){
            throw new CommonException(CustomExceptionStatus.ITEM_NOT_CAPSULE);
        }

        // 골드가 부족한지 확인
        if(items.getPrice() > user.getCoin()){
            throw new CommonException(CustomExceptionStatus.USER_NOT_ENOUGH_COIN);
        }

        // 최대가 아닌지 확인 (최대값 10 개)
        if(user.getMaxCapsuleCount() >= MAX_CAPSULE_LIMIT){
            throw new CommonException(CustomExceptionStatus.CAPSULE_MAXLIMIT);
        }

        //구매 가능 돈 차감
        user.setCoin(user.getCoin() - items.getPrice());

        //유저 가질수 있는 타임캡슐 개수 증가
        user.setMaxCapsuleCount(user.getMaxCapsuleCount() + 1);
        userRepository.save(user);

        Map<String, Object> result = new HashMap<>();
        result.put("userInfo", user.toUserDTO());

        return result;
    }

    /*
        유저의 타임캡슐
     */
    @Override
    public List<TimecapsuleShopDTO> timecapsuleList() {

        Long userNo = getUserNo();
        List<TimecapsuleMapping> timecapsules = timecapsuleMappingRepository.findByUserUserNo(userNo);

        //타임캡슐이 있는지?
        if(timecapsules.size() < 1){
            throw new CommonException(CustomExceptionStatus.NOT_TIMECAPSULE);
        }
        //진행중인 타임캡슐
        List<TimecapsuleMapping> workTimecapsules = new ArrayList<>();
        for(TimecapsuleMapping timecapsule : timecapsules){
            if( timecapsule.isSave() == false) workTimecapsules.add(timecapsule);
        }

        //진행중인 타임캡슐이 없다면
        if(workTimecapsules.size() < 1){
            throw new CommonException(CustomExceptionStatus.NOT_WORK_TIMECAPSULE);
        }

        //진행중인 타임캡슐의 상세정보
        List<TimecapsuleShopDTO> timecapsuleList = new ArrayList<>();
        for(TimecapsuleMapping timecapsule : workTimecapsules){
            timecapsuleList.add(timecapsule.getTimecapsule().toTimecapsuleShopDTO());
        }

        return timecapsuleList;
    }

    /*
        사이즈 구매
     */
    @Override
    public void timecapsuleSize(Long timecapsuleNo, Long itemNo) {

        Long userNo = getUserNo();
        User user = userRepository.findByUserNo(userNo).orElseThrow(
                () -> new CommonException(CustomExceptionStatus.NOT_USER));

       //해당 타임캡슐이 없다면
       Timecapsule timecapsule = timecapsuleRepository.findById(timecapsuleNo)
               .orElseThrow(() -> new CommonException(CustomExceptionStatus.NOT_TIMECAPSULE));

        // 해당 아이템이 있는지 조건 확인
        Items items = itemsRepository.findByItemNo(itemNo)
                .orElseThrow(() -> new CommonException(CustomExceptionStatus.ITEM_NOT_FOUND));

        //해당 유저가 맵핑된 타임캡슐이 아니란면
       timecapsuleMappingRepository.findByUserUserNoAndTimecapsuleTimecapsuleNo(userNo, timecapsuleNo)
               .orElseThrow(() -> new CommonException(CustomExceptionStatus.USER_NOT_TIMECAPSULE));

        //타임캡슐의 용량이 최대라면
       if(timecapsule.getMaxFileSize() >= MAX_FILE_SIZE){
            throw new CommonException(CustomExceptionStatus.CAPSULE_MAXSIZE);
       }

       //해당 아이템이 용량증가 아이템이 아니라면
        if(!items.getType().equals("STORAGE")){
            throw new CommonException(CustomExceptionStatus.ITEM_NOT_STORAGE);
        }

        //구매하려는 아이템보다 가격이 적다면
        if(items.getPrice() > user.getCoin()){
            throw new CommonException(CustomExceptionStatus.USER_NOT_ENOUGH_COIN);
        }

        //유저 돈차감
        user.setCoin(user.getCoin() - items.getPrice());
        userRepository.save(user);

        //타임캡슐 용량 증가
        timecapsule.setMaxFileSize(timecapsule.getMaxFileSize() + UP_FILE_SIZE);
        timecapsuleRepository.save(timecapsule);



    }


}
