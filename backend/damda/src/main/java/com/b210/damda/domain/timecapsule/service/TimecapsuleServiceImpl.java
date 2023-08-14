package com.b210.damda.domain.timecapsule.service;

import com.b210.damda.domain.dto.Timecapsule.*;
import com.b210.damda.domain.dto.weather.WeatherLocationDTO;
import com.b210.damda.domain.dto.weather.WeatherLocationNameDTO;
import com.b210.damda.domain.entity.Items.ItemDetails;
import com.b210.damda.domain.entity.Items.ItemsMapping;
import com.b210.damda.domain.entity.Timecapsule.*;
import com.b210.damda.domain.entity.User.User;
import com.b210.damda.domain.entity.User.UserCoinGetLog;
import com.b210.damda.domain.entity.User.UserFriend;
import com.b210.damda.domain.file.service.S3UploadService;
import com.b210.damda.domain.friend.repository.FriendRepository;
import com.b210.damda.domain.shop.repository.ItemDetailsRepository;
import com.b210.damda.domain.shop.repository.ItemsMappingRepository;
import com.b210.damda.domain.shop.service.ShopService;
import com.b210.damda.domain.timecapsule.repository.*;
import com.b210.damda.domain.user.repository.UserCoinGetLogRepository;
import com.b210.damda.domain.user.repository.UserRepository;
import com.b210.damda.util.exception.CommonException;
import com.b210.damda.util.exception.CustomExceptionStatus;
import com.b210.damda.util.weatherAPI.service.WeatherAPIService;
import com.b210.damda.util.weatherAPI.service.WeatherLocationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.security.SecureRandom;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
@Slf4j
public class TimecapsuleServiceImpl implements TimecapsuleService{

    private final TimecapsuleMappingRepository timecapsuleMappingRepository;
    private final TimecapsuleRepository timecapsuleRepository;
    private final TimecapsuleCardRepository timecapsuleCardRepository;
    private final TimecapsuleCriteriaRepository timecapsuleCriteriaRepository;
    private final UserRepository userRepository;
    private final CirteriaDayRepository cirteriaDayRepository;
    private final FriendRepository friendRepository;
    private final TimecapsuleInviteRepository timecapsuleInviteRepository;
    private final ItemsMappingRepository itemsMappingRepository;
    private final ItemDetailsRepository itemDetailsRepository;
    private final UserLocationRepository userLocationRepository;
    private final TimecapsuleFileRepository timecapsuleFileRepository;
    private final UserCoinGetLogRepository userCoinGetLogRepository;

    //날씨 서비스 접근
    private final WeatherLocationService weatherLocationService;
    private final WeatherAPIService weatherAPIService;
    private final ShopService shopService;
    private final S3UploadService s3UploadService;

    private final int MAX_PARTICIOPANT = 10;
    private final Long MAX_FILESIZE = (long) 50 * (1024 * 1024);
    private final int NOW_PARTICIOPANT = 1;
    private final int CARD_COIN_GET = 50;

    //한국 시간 설정
    private static final ZoneId SEOUL_ZONE_ID = ZoneId.of("Asia/Seoul");

    /*
        시큐리티에있는 유저NO 불러오기
     */
    public Long getUserNo(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        Long userNo = (Long) principal;

        return userNo;
    }

    // 24시간이 지났는지 판단
    long millisecondsInADay = 24 * 60 * 60 * 1000;  // 24시간을 밀리초로 변환

    /*
        유저 정보 불러오기
     */
    public User getUser(Long userNo){
        User user = userRepository.findByUserNo(userNo).orElseThrow(
                () -> new CommonException(CustomExceptionStatus.NOT_USER));
        return user;
    }

    /*
        타임캡슐 정보 불러오기
     */
    public Timecapsule getTimecapsule(Long timecapsuleNo){
        Timecapsule timecapsule = timecapsuleRepository.findById(timecapsuleNo).orElseThrow(
                () -> new CommonException(CustomExceptionStatus.NOT_TIMECAPSULE));

        //완전히 삭제된 타임캡슐이라면
        if (timecapsule.getRemoveDate() != null){
            throw new CommonException(CustomExceptionStatus.DELETE_TIMECAPSULE);
        }

        return timecapsule;
    }

    /*
        유저 맵핑 정보 불러오기
     */
    public TimecapsuleMapping getTimecapsuleMapping(Long userNo, Long timecapsuleNo){
        //캡슐 - 유저 매핑된게 아니라면
        TimecapsuleMapping myMapping = timecapsuleMappingRepository
                .findByUserUserNoAndTimecapsuleTimecapsuleNo(userNo, timecapsuleNo)
                .orElseThrow(
                        () -> new CommonException(CustomExceptionStatus.USER_NOT_TIMECAPSULE));

        return myMapping;
    }


    /*
        진행중인 타임캡슐 리스트 받아오기
     */
    public List<TimecapsuleMapping> getWorkTimecapsuleList(Long userNo){
        List<TimecapsuleMapping> workTimecapsule = timecapsuleMappingRepository.findWorkTimecapsules(userNo);
        //진행중인 타임캡슐이 없다면
        if(workTimecapsule.size() < 1){
            throw new CommonException(CustomExceptionStatus.NOT_WORK_TIMECAPSULE);
        }
        return workTimecapsule;
    }

    /*
        저장된 타임캡슐 리스트 받아오기
     */
    public List<TimecapsuleMapping> getSaveTimecapsuleList(Long userNo){
        List<TimecapsuleMapping> saveTimecapsule = timecapsuleMappingRepository.findSaveTimecapsules(userNo);
        //저장된 타임캡슐이 없는경우
        if(saveTimecapsule.size() < 1){
            throw new CommonException(CustomExceptionStatus.NOT_SAVE_TIMECAPSULE);
        }
        return saveTimecapsule;
    }

    /*
        메인화면 타임캡슐 리스트 불러오기
     */
    @Override
    public List<MainTimecapsuleListDTO> workTimecapsule(WeatherLocationDTO weatherLocationDto) {
        Long userNo = getUserNo();
        User user = getUser(userNo);
        List<TimecapsuleMapping> workTimecapsules = getWorkTimecapsuleList(userNo);

        List<MainTimecapsuleListDTO> timecapsuleList = new ArrayList<>();
        for(TimecapsuleMapping timecapsule : workTimecapsules){
            MainTimecapsuleListDTO mainTimecapsule = timecapsule.getTimecapsule().toMainTimecapsuleListDTO();

            /*
                24시간 내 외이냐? 등록이 안되거는 FALSE
             */
            LocalDateTime registTime = timecapsule.getTimecapsule().getRegistDate().toLocalDateTime();
            LocalDateTime nowTime = LocalDateTime.now();
            boolean isRegisted = false;
            //지났다면 등록됬다고 변경
            if(nowTime.isAfter(registTime.plusHours(24))) isRegisted = true;
            mainTimecapsule.setRegisted(isRegisted);
            /*
                오픈조건 검증 로직
             */
            //목표 타임캡슐이라면
            if(mainTimecapsule.getType().equals("GOAL")){
                List<TimecapsuleCard> cards = timecapsuleCardRepository
                        .findByTimecapsuleTimecapsuleNo(mainTimecapsule.getTimecapsuleNo());
                //저장된 타임캡슐값
                mainTimecapsule.setCurCard(cards.size());
                //상태값 설정 (조건 성립)
                if(mainTimecapsule.getGoalCard() <= mainTimecapsule.getCurCard()) mainTimecapsule.setState(true);
            }
            else{
                boolean openAble = true;
                //타임캡슐 조건 테이블 받아오기
                TimecapsuleCriteria timecapsuleCriteria = timecapsule.getTimecapsule().getTimecapsuleCriteria();
                //날씨와 지역 조건이 있다면
                if(timecapsuleCriteria.getWeatherStatus() != null || timecapsuleCriteria.getLocalBig() != null) {
                    weatherLocationDto.setMode(true);
                    WeatherLocationNameDTO location = null;
                    //현재 위치값 받기
                    try { location = weatherLocationService.getNowLocation(weatherLocationDto); }
                    catch (Exception e) { throw new CommonException(CustomExceptionStatus.NOT_LOCATION_FIND); }

                    //위치가 있을경우
                    if (timecapsuleCriteria.getLocalBig() != null && !timecapsuleCriteria.getLocalBig().trim().equals("")) {
                        //LocalBig과 LocalMedium 이 같지 않으면 오픈 조건 미성립!
                        if(timecapsuleCriteria.getLocalBig().equals(location.getLocalBig()) && 
                            timecapsuleCriteria.getLocalMedium().equals(location.getLocalMedium()));
                        else openAble = false;
                    }
                    //날씨가 있는 경우
                    if(timecapsuleCriteria.getWeatherStatus() != null){
                        // 날씨를 갱신 해야하는 가?
                        UserLocation userLocation = userLocationRepository.findByUserUserNo(userNo);
                        // 위치 저장된 곳이 없다면 -> 새로 생성
                        if(userLocation == null){
                            userLocation = new UserLocation();
                            userLocation.CreateUserLocation(
                                    user, timecapsuleCriteria.getLocalBig(), timecapsuleCriteria.getLocalMedium(),
                                    Timestamp.valueOf(LocalDateTime.now())
                            );
                            //날씨 조회 하면서 저장
                            userLocation = renewWeather(weatherLocationDto, userLocation);
                        }
                        else{
                            //현재 위치랑 같다면
                            if (userLocation.getLocalBig().equals(location.getLocalBig()) &&
                                    userLocation.getLocalMedium().equals(location.getLocalMedium())) {
                                //날씨 갱신이 필요한가 - 현재 시간과 userLocationTime의 시간값의 차이를 계산
                                LocalDateTime userLocationTime = userLocation.getWeatherTime().toLocalDateTime();
                                long hourDifference = LocalDateTime.now().getHour() - userLocationTime.getHour();
                                // userLocationTime 이 하루 이상 지났거나, 시간 차이가 1 이상이거나 , 날씨 정보값이 null인경
                                if (userLocationTime.isBefore(LocalDateTime.now().minusDays(1)) || Math.abs(hourDifference) >= 1
                                        || userLocation.getWeather() == null || userLocation.getWeather().trim().equals("")) {
                                    //날씨 갱신
                                    userLocation = renewWeather(weatherLocationDto, userLocation);
                                }
                            }
                            //현재 위치가 다르다면
                            else{
                                //날씨 갱신
                                userLocation = renewWeather(weatherLocationDto, userLocation);
                            }
                        }//날씨가 갱신이 완료됨
                        if(userLocation.getWeather().indexOf(timecapsuleCriteria.getWeatherStatus()) == -1 ){
                            openAble = false;
                        }
                    }
                }
                //시간 조건 확인 (한국)
                ZonedDateTime seoulTime = LocalDateTime.now().atZone(SEOUL_ZONE_ID);
                //캡슐 오픈 날짜
                ZonedDateTime openDate = timecapsule.getTimecapsule().getOpenDate()
                        .toLocalDateTime().atZone(SEOUL_ZONE_ID);
                //날짜가 지났다면 (날짜만 비교 LocalDate)
                if(seoulTime.isAfter(openDate)){
                    //시간을 설정했고 그 설정한시간보다 전이라면
                    if( timecapsule.getTimecapsule().getTimecapsuleCriteria().getStartTime() != null
                            && seoulTime.getHour() < timecapsule.getTimecapsule()
                            .getTimecapsuleCriteria().getStartTime()) openAble = false;
                }else openAble = false;
                //모든 조건이 지나긴후
                mainTimecapsule.setState(openAble);
                System.out.println(123);
            }
            System.out.println(123);
            timecapsuleList.add(mainTimecapsule);
        }

        return timecapsuleList;
    }

    /*
        저장된 타임캡슐 리스트 불러오기
     */
    @Override
    public List<SaveTimecapsuleListDTO> saveTimecapsule(){

        Long userNo = getUserNo();

        List<TimecapsuleMapping> saveTimecapsules = getSaveTimecapsuleList(userNo);

        /*
            저장된 타임캡슐 DTO 변화 및 타입이 GOAL 이면 OPENDATE 받아온다
         */
        List<SaveTimecapsuleListDTO> saveTimecapsuleList = new ArrayList<>();
        for(TimecapsuleMapping timecapsuleMapping : saveTimecapsules){
            Timecapsule timecapsule = timecapsuleMapping.getTimecapsule();
            SaveTimecapsuleListDTO saveTimecapsule = timecapsule.toSaveTimecapsuleListDTO();
            if(saveTimecapsule.getType().equals("GOAL")) {
                saveTimecapsule.setEndDate(timecapsuleMapping.getSaveDate());
            }
            saveTimecapsuleList.add(saveTimecapsule);
        }

        return saveTimecapsuleList;
    }
    /*
        타임캡슐 생성하기
     */
    @Override
    public Long createTimecapsule(TimecapsuleCreateDTO timecapsuleCreateDTO) {

        Long userNo = getUserNo();
        User user = getUser(userNo);

        //타임캡슐 생성 불가 로직 ( 최대값 도달 )
        if(user.getMaxCapsuleCount() <= user.getNowCapsuleCount()){
            throw new CommonException(CustomExceptionStatus.NOT_CREATE_TIMECAPSULE_USERLIMIT);
        }

         //DTO Entitiy 변환
         Timecapsule createTimecapsule = timecapsuleCreateDTO.toEntity();

         //타임캡슐 추가 기본값 세팅
        createTimecapsule.timecapsuleDefaultSetting(
                Timestamp.valueOf(LocalDateTime.now().withSecond(0).withNano(0)),
                MAX_FILESIZE, MAX_PARTICIOPANT, createKey(), NOW_PARTICIOPANT,
                new Random().nextInt(10)+1
                );

         //타임캡슐 저장 후 No값 받아오기
         Timecapsule saveTimecapsule = timecapsuleRepository.save(createTimecapsule);

         //타임캡슐 생성 에러발생
         if(saveTimecapsule.getTimecapsuleNo() == null){
             throw new CommonException(CustomExceptionStatus.CREATE_TIMECAPSULE);
         }

         if(timecapsuleCreateDTO.getType().equals("GOAL")){
             List<String> dayNames = Arrays.asList("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday");
             //카드 작성 요일 등록
             if(timecapsuleCreateDTO.getCardInputDay().size() > 0){
                for(String cardDay : timecapsuleCreateDTO.getCardInputDay()){

                    int index = dayNames.indexOf(cardDay);
                    if(index != -1){
                        String dayKr = Arrays.asList("월", "화", "수", "목", "금", "토", "일").get(index);

                        CirteriaDay cirteriaDay = new CirteriaDay();
                        cirteriaDay.createCirteriaDay(saveTimecapsule.getTimecapsuleCriteria(),
                                cardDay, dayKr
                                );
                        CirteriaDay saveCirteriaDay = cirteriaDayRepository.save(cirteriaDay);
                        // 요일 저장 에러 발생
                        if(saveCirteriaDay.getDayNo() == null) {
                            throw new CommonException(CustomExceptionStatus.CREATE_CIRTERIADAY);
                        }
                    }
                }
             }
         }

         //타임캡슐 유저 맵핑 (생성)
         TimecapsuleMapping timecapsuleMapping = new TimecapsuleMapping();
         timecapsuleMapping.createTimecapsuleMapping(user, saveTimecapsule, true);
         TimecapsuleMapping saveMapping = timecapsuleMappingRepository.save(timecapsuleMapping);

         // 저장 에러
         if(saveMapping.getTimecapsuleMappingNo() == null){
             throw new CommonException(CustomExceptionStatus.CREATE_TIMECAPSULEUSERMAPPING);
         }

         //유저의 현재 타임캡슐 갯수 증가
         user.setNowCapsuleCount(user.getNowCapsuleCount() + 1);
         userRepository.save(user);

        return saveTimecapsule.getTimecapsuleNo();
    }

    /*
        타임캡슐 디테일
     */
    @Override
    public TimecapsuleDetailDTO getTimecapsuleDetail(Long timecapsuleNo){
        Long userNo = getUserNo();

        //유저
        User user = getUser(userNo);
        //타임캡슐
        Timecapsule timecapsule = getTimecapsule(timecapsuleNo);
        //타임캡슐 맵핑여부
        TimecapsuleMapping myMapping = getTimecapsuleMapping(userNo, timecapsuleNo);

        //삭제시간이 있다면
        if(myMapping.getDeleteDate() != null){
            if(myMapping.isSave())  throw new CommonException(CustomExceptionStatus.DELETE_TIMECAPSULE);
            else  throw new CommonException(CustomExceptionStatus.NOT_ALLOW_PARTICIPATE);
        }
        //isSave가 false 이면서 deleteDate가 있는거를 제외한 참가자 조회
        List<TimecapsuleMapping> participant = timecapsuleMappingRepository.findNotSavedButDeleted(timecapsuleNo);

        //디테일 타임캡슐 생성
        TimecapsuleDetailDTO timecapsuleDetail = timecapsule.toTimecapsuleDetailDTO();
        if(timecapsuleDetail.getCapsuleType().equals("GOAL")){
           timecapsuleDetail.setNowCard(timecapsuleCardRepository.countByTimecapsuleTimecapsuleNo(timecapsuleNo));
        }

        //해당 캡슐의 나의 정보 세팅
        timecapsuleDetail.setMyInfo(myMapping.toDetailMyInfoDTO());
        //참가자 세팅
        timecapsuleDetail.setPartInfo(
                participant.stream().map(TimecapsuleMapping::toDetailPartInfoDTO)
                        .collect(Collectors.toList())
        );

        //캡슐 요일추가
        List<CirteriaDayDTO> cirteriaDays = cirteriaDayRepository.findByTimecapsuleCriteriaCriteriaId(
                timecapsuleDetail.getCriteriaInfo().getCriteriaId())
                .stream()
                .map(CirteriaDay::toCirteriaDayDTO).collect(Collectors.toList());

        if(cirteriaDays.isEmpty()) timecapsuleDetail.getCriteriaInfo().setCirteriaDays(null);
        else timecapsuleDetail.getCriteriaInfo().setCirteriaDays(cirteriaDays);

        return timecapsuleDetail;
    }

    /*
        나의 카드 데코 아이템 리스트 받아오기
     */
    @Override
    public List<MyItemListDTO> getMyDecoList() {

        Long UserNo = getUserNo();
        List<ItemsMapping> decoItemList = itemsMappingRepository.findByUserUserNo(UserNo);

        //구입한 데코 아이템이 없습니다!
        if(decoItemList.isEmpty()){
            throw new CommonException(CustomExceptionStatus.NOT_BUY_DECOITEM);
        }

        List<MyItemListDTO> decoMyItemList = new ArrayList<>();
        for(ItemsMapping itemMapping : decoItemList){
           MyItemListDTO myItem = itemMapping.toMyItemListDTO();
           List<ItemDetails> detailList =  itemDetailsRepository.findByItemsItemNo(myItem.getItemNo());
           //디테일 값 세팅
           Map<String, Object> stickers = new HashMap<>();
           int count = 1;
           for(ItemDetails detail : detailList){
               stickers.put("s"+ count, detail.getPath());
               count++;
           }
           //스티커 리스트값 세팅
           myItem.setSticker(stickers);
           decoMyItemList.add(myItem);
        }

        return decoMyItemList;
    }

    /*
        카드 작성하기
     */
    @Override
    public void registCard(MultipartFile cardImage, Long timecapsuleNo) {
        //유저
        Long userNo = getUserNo();
        User user = getUser(userNo);
        //타임캡슐
        Timecapsule timecapsule = getTimecapsule(timecapsuleNo);
        //캡슐 - 유저 맵핑
        TimecapsuleMapping myMapping = getTimecapsuleMapping(userNo, timecapsuleNo);

        //오늘은 이미카드작성을 하였습니다.
        if(myMapping.isCardAble() == false){
            throw new CommonException(CustomExceptionStatus.ALREADY_CARD_UPLOAD);
        }

        String fileUri = "";

        //S3에 저장
        if (cardImage.isEmpty() && cardImage.getSize() == 0) {
            throw new CommonException(CustomExceptionStatus.NOT_CARDIMAGE);
        } else {
            try {
                fileUri = s3UploadService.cardSaveFile(cardImage, timecapsuleNo);
            } catch (IOException e) {
                throw new CommonException(CustomExceptionStatus.NOT_S3_CARD_SAVE);
            }
        }


        //카드 작성했다고 세팅
        myMapping.updateCardAble(false);
        timecapsuleMappingRepository.save(myMapping);

        //카드 세팅
        TimecapsuleCard card = new TimecapsuleCard();
        card.createCard(timecapsule, user, fileUri,
                Timestamp.valueOf(LocalDateTime.now()));

        TimecapsuleCard saveCard = timecapsuleCardRepository.save(card);

        //에러메세지
        if (saveCard.getTimecapsuleCardNo() == null) {
            throw new CommonException(CustomExceptionStatus.NOT_CARD_SAVE);
        }

        // 코인 획득
        user.setCoin(user.getCoin() + CARD_COIN_GET);
        userRepository.save(user);

        // 코인 획득 로그 추가
        UserCoinGetLog userCoinGetLog = new UserCoinGetLog(user, CARD_COIN_GET, "CARD");
        userCoinGetLogRepository.save(userCoinGetLog);

    }
    
    // 타임캡슐 참여코드로 참가
    @Override
    @Transactional
    public TimecapsuleDetailDTO joinTimecalsule(String inviteCode) {
        Timecapsule timecapsule = timecapsuleRepository.findByInviteCode(inviteCode);

        // 타임캡슐이 없는 경우
        if(timecapsule == null){
            throw new CommonException(CustomExceptionStatus.NOT_TIMECAPSULE);
        }

        Long userNo = getUserNo(); // 현재 유저의 pk를 찾음
        User user = userRepository.findById(userNo).get();

        // 유저의 타임캡슐 한도 확인
        if(user.getMaxCapsuleCount() == user.getNowCapsuleCount()){
            throw new CommonException(CustomExceptionStatus.FULL_USER_TIMECAPSULE);
        }

        // 이미 유저가 나갔거나 추방당했다면
        Optional<TimecapsuleMapping> mapping = timecapsuleMappingRepository.findByUserUserNoAndTimecapsuleTimecapsuleNo(userNo, timecapsule.getTimecapsuleNo());
        // 이미 나갔거나 추방당했다는 기록이 있는 경우
        if(mapping.isPresent() && mapping.get().getDeleteDate() != null){
            throw new CommonException(CustomExceptionStatus.NOT_ALLOW_PARTICIPATE);
        }else if (mapping.isPresent() && mapping.get().getUser().getUserNo() == userNo){ // 이미 참가중이라면
            throw new CommonException(CustomExceptionStatus.ALREADY_PARTICIPATING);
        }

        Timestamp currentTimestamp = new Timestamp(System.currentTimeMillis());

        // 타임캡슐이 생성된 지 24시간이 지나서 참여 불가
        if(currentTimestamp.getTime() - timecapsule.getRegistDate().getTime() > millisecondsInADay){
            throw new CommonException(CustomExceptionStatus.NOT_ALLOW_PARTICIPATE);
        }   
        // 타임캡슐의 인원이 꽉 찼으면
        if(timecapsule.getNowParticipant() >= MAX_PARTICIOPANT){
            throw new CommonException(CustomExceptionStatus.MAX_PARTICIPATING);
        }

        // 현재 타임캡슐의 인원 +1
        timecapsule.updateNowParticipant();
        timecapsuleRepository.save(timecapsule);

        // 유저의 타임캡슐 + 1
        user.setNowCapsuleCount(user.getNowCapsuleCount() + 1);
        userRepository.save(user);
        
        // 타임캡슐 매핑 만들어서 저장
        TimecapsuleMapping timecapsuleMapping = new TimecapsuleMapping(timecapsule, user);
        timecapsuleMappingRepository.save(timecapsuleMapping);

        //디테일 타임캡슐 생성
        TimecapsuleDetailDTO timecapsuleDetail = timecapsule.toTimecapsuleDetailDTO();
        if(timecapsuleDetail.getCapsuleType().equals("GOAL")){
            timecapsuleDetail.setNowCard(timecapsuleCardRepository.countByTimecapsuleTimecapsuleNo(timecapsule.getTimecapsuleNo()));
        }

        // 타임캡슐 초대목록에 해당 유저 ACCEPTED로 생성
        TimecapsuleInvite timecapsuleInvite = new TimecapsuleInvite();
        timecapsuleInvite.createTimecapsuleInvite(timecapsule, user);
        timecapsuleInviteRepository.save(timecapsuleInvite);

        //isSave가 false 이면서 deleteDate가 있는거를 제외한 참가자 조회
        List<TimecapsuleMapping> participant = timecapsuleMappingRepository.findNotSavedButDeleted(timecapsule.getTimecapsuleNo());

        //해당 캡슐의 나의 정보 세팅
        timecapsuleDetail.setMyInfo(timecapsuleMapping.toDetailMyInfoDTO());
        //참가자 세팅
        timecapsuleDetail.setPartInfo(
                participant.stream().map(TimecapsuleMapping::toDetailPartInfoDTO)
                        .collect(Collectors.toList())
        );

        //캡슐 요일추가
        List<CirteriaDayDTO> cirteriaDays = cirteriaDayRepository.findByTimecapsuleCriteriaCriteriaId(
                        timecapsuleDetail.getCriteriaInfo().getCriteriaId())
                .stream()
                .map(CirteriaDay::toCirteriaDayDTO).collect(Collectors.toList());

        if(cirteriaDays.isEmpty()) timecapsuleDetail.getCriteriaInfo().setCirteriaDays(null);
        else timecapsuleDetail.getCriteriaInfo().setCirteriaDays(cirteriaDays);


        return timecapsuleDetail;

    }

    // 타임캡슐 초대목록 가져오기
    @Override
    public List<TimecapsuleInviteListDTO> getTimecapsuleInviteList(Long timecapsuleNo) {

        List<TimecapsuleInviteListDTO> responseData = new ArrayList<>();

        // 현재 유저 꺼냄
        Long userNo = getUserNo();
        User currentUser = userRepository.findById(userNo).get();

        // 타임캡슐 꺼냄
        Optional<Timecapsule> byIdTimecapsule = timecapsuleRepository.findById(timecapsuleNo);

        // 타임캡슐이 없을 경우
        if(byIdTimecapsule.isEmpty()){
            throw new CommonException(CustomExceptionStatus.NOT_TIMECAPSULE);
        }

        // 현재 유저의 타임캡슐매핑을 가져옴.
        TimecapsuleMapping byUserUserNoOne = timecapsuleMappingRepository.findByUserUserNoOne(timecapsuleNo, userNo);

        // 현재 유저가 방장이 아니면
        if(!byUserUserNoOne.isHost()){
            throw new CommonException(CustomExceptionStatus.NOT_TIMECAPSULE_HOST);
        }


        Timecapsule timecapsule = byIdTimecapsule.get();

        // 타임캡슐이 생성된 지 24시간이 지나서 초대 불가
        Timestamp currentTimestamp = new Timestamp(System.currentTimeMillis());

        if (currentTimestamp.getTime() - timecapsule.getRegistDate().getTime() > millisecondsInADay) {
            throw new CommonException(CustomExceptionStatus.NOT_INVITE_FRIEND);
        }

        // 타임캡슐의 인원이 꽉 찼으면
        if (timecapsule.getNowParticipant() >= MAX_PARTICIOPANT) {
            throw new CommonException(CustomExceptionStatus.NOT_ALLOW_PARTICIPATE);
        }

        // 수락상태고, 탈퇴안한 친구의 목록을 가져옴.
        String status = "ACCEPTED";
        List<UserFriend> userFriendByUser = friendRepository.findUserFriendByUser(currentUser, status);

        // 타임캡슐의 번호로 초대 목록을 찾음.
        List<TimecapsuleInvite> timecapsuleInviteList = timecapsuleInviteRepository.getTimecapsuleInviteByTimecapsule(timecapsule);

        // 타임캡슐 매핑리스트 꺼내옴.
        List<TimecapsuleMapping> timecapsuleMappings = timecapsuleMappingRepository.findByIdNo(timecapsuleNo);

        Map<Long, TimecapsuleInvite> inviteMap = timecapsuleInviteList.stream()
                .collect(Collectors.toMap(TimecapsuleInvite::getGuestUserNo, Function.identity()));

        for (UserFriend userFriend : userFriendByUser) {
            TimecapsuleInviteListDTO dto = new TimecapsuleInviteListDTO();
            User friend = userFriend.getFriend();

            dto.setUserNo(friend.getUserNo());
            dto.setProfileImage(friend.getProfileImage());
            dto.setNickname(friend.getNickname());

            // 초대 상태 확인
            TimecapsuleInvite invite = inviteMap.get(friend.getUserNo());

            if (invite != null) {
                dto.setStatus(invite.getStatus());  // 만약 초대목록에 있으면 상태 설정
            } else {
                dto.setStatus("");  // 아직 초대하지 않은 상태
            }

            responseData.add(dto);
        }

        return responseData;
    }


    // 타임캡슐 초대하기
    @Override
    @Transactional
    public void timecapsuleInviteUser(TimecapsuleInviteUserDTO timecapsuleInviteUserDTO) {

        // 현재 유저 찾기
        Long userNo = getUserNo();
        User user = userRepository.findById(userNo).get();

        // 초대하는 친구 유저 찾기
        Long friendUserNo = timecapsuleInviteUserDTO.getFriendNo();
        User friendUser = userRepository.findByUserNoAndDeleteDateIsNull(friendUserNo);

        // 해당 친구가 없는 경우
        if(friendUser == null){
            throw new CommonException(CustomExceptionStatus.NOT_USER);
        }

        Optional<Timecapsule> timecapsuleData = timecapsuleRepository.findById(timecapsuleInviteUserDTO.getTimecapsuleNo());

        // 해당 타임캡슐이 존재하지 않으면
        if(timecapsuleData.isEmpty()){
            throw new CommonException(CustomExceptionStatus.NOT_TIMECAPSULE);
        }

        // 해당 타임캡슐을 꺼냄
        Timecapsule timecapsule = timecapsuleData.get();

        // 친구 번호로 타임캡슐 초대 데이터 찾음.
        Optional<TimecapsuleInvite> timecapsuleInviteDate = timecapsuleInviteRepository.getTimecapsuleInviteByTimecapsuleAndGuestUserNo(timecapsule, friendUserNo);

        if(timecapsuleInviteDate.isEmpty()){
            TimecapsuleInvite timecapsuleInvite1 = new TimecapsuleInvite();
            timecapsuleInvite1.friendTimecapsuleInvite(timecapsule, friendUser);
            timecapsuleInviteRepository.save(timecapsuleInvite1);
        }else {
            TimecapsuleInvite timecapsuleInvite = timecapsuleInviteDate.get();
            // 이미 초대했을 경우
            if(timecapsuleInvite.getStatus().equals("NOTREAD")){
                throw new CommonException(CustomExceptionStatus.ALREADY_INVITED_USER);
            }else if(timecapsuleInvite.getStatus().equals("ACCEPTED")){ // 이미 참여중
                throw new CommonException(CustomExceptionStatus.ALREADY_JOIN_TIMECAPSULE);
            }else { // 이미 강퇴당했거나 나간 유저
                throw new CommonException(CustomExceptionStatus.ALREADY_KICKED_OUT_USER);
            }
        }
    }


    // 타임캡슐 초대 수락
    @Override
    @Transactional
    public void timecapsuleInviteAccept(TimecapsuleInviteAcceptDTO timecapsuleInviteAcceptDTO) {

        TimecapsuleMapping timecapsuleMapping = new TimecapsuleMapping();

        // 현재 유저 꺼내옴
        Long userNo = getUserNo();
        User user = userRepository.findById(userNo).get();

        // 현재 타임캡슐을 꺼내옴
        Optional<Timecapsule> timecapsuleData = timecapsuleRepository.findById(timecapsuleInviteAcceptDTO.getTimecapsuleNo());
        // 타임캡슐이 존재하지 않으면
        if(timecapsuleData.isEmpty()){
            throw new CommonException(CustomExceptionStatus.NOT_TIMECAPSULE);
        }
        Timecapsule timecapsule = timecapsuleData.get();

        Optional<TimecapsuleMapping> byUserAnAndTimecapsule = timecapsuleMappingRepository.findByUserAndTimecapsule(user, timecapsule);

        // 이미 타임캡슐 참여중인지 판단
        if(byUserAnAndTimecapsule.isPresent()){
            // 타임캡슐을 나갔거나 추방당한 유저인지 판단
            if(byUserAnAndTimecapsule.get().getDeleteDate() != null){
                throw new CommonException(CustomExceptionStatus.NOT_ALLOW_PARTICIPATE);
            }
            throw new CommonException(CustomExceptionStatus.ALREADY_PARTICIPATING);
        }

        // 현재 유저의 타임캡슐 개수가 충분한지 판단.
        if(user.getMaxCapsuleCount() == user.getNowCapsuleCount()){
            throw new CommonException(CustomExceptionStatus.FULL_USER_TIMECAPSULE);
        }

        // 타임캡슐 초대를 꺼냄
        Optional<TimecapsuleInvite> timecapsuleInviteData = timecapsuleInviteRepository.getTimecapsuleInviteByTimecapsuleAndGuestUserNo(timecapsule, userNo);

        // 타임캡슐에 초대 기록이 없으면
        if(timecapsuleInviteData.isEmpty()){
            throw new CommonException(CustomExceptionStatus.NOT_ALLOW_PARTICIPATE);
        }

        TimecapsuleInvite timecapsuleInvite = timecapsuleInviteData.get();

        // 타임캡슐 초대 기록이 NOTREAD가 아니면
        if(!timecapsuleInvite.getStatus().equals("NOTREAD")){
            throw new CommonException(CustomExceptionStatus.NOT_ALLOW_PARTICIPATE);
        }else if(timecapsuleInvite.getStatus().equals("ACCEPTED")){
            throw new CommonException(CustomExceptionStatus.ALREADY_JOIN_TIMECAPSULE);
        }else if(timecapsuleInvite.getStatus().equals("REJECTED")){
            throw new CommonException(CustomExceptionStatus.NOT_RECORD_INVITE);
        }

        // 타임캡슐이 삭제되었다면
        if(timecapsule.getRemoveDate() != null){
            throw new CommonException(CustomExceptionStatus.DELETE_TIMECAPSULE);
        }

        // 타임캡슐을 생성한 지 24시간이 지났다면
        Timestamp currentTimestamp = new Timestamp(System.currentTimeMillis());
        if(currentTimestamp.getTime() - timecapsule.getRegistDate().getTime() > millisecondsInADay){
            throw new CommonException(CustomExceptionStatus.NOT_ALLOW_PARTICIPATE);
        }

        // 현재 타임캡슐의 참여인원이 최대인원을 넘지 않았는지 판단
        if(timecapsule.getNowParticipant() == timecapsule.getMaxParticipant()){
            throw new CommonException(CustomExceptionStatus.MAX_PARTICIPATING);
        }

        // 해당 타임캡슐 초대 기록을 ACCEPTED, 응답시간을 추가
        timecapsuleInvite.acceptTimecapsuleInvite(timecapsuleInvite);
        timecapsuleInviteRepository.save(timecapsuleInvite);

        // 타임캡슐 매핑 데이터 생성
        TimecapsuleMapping timecapsuleMapping1 = new TimecapsuleMapping(timecapsule, user);
        timecapsuleMappingRepository.save(timecapsuleMapping1);

        // 유저의 현재 타임캡슐 +1
        user.setNowCapsuleCount(user.getNowCapsuleCount() + 1);
        userRepository.save(user);

        // 타임캡슐 현재 인원 +1
        timecapsule.updateNowParticipant(timecapsule.getNowParticipant() + 1);
        timecapsuleRepository.save(timecapsule);
    }

    // 타임캡슐 초대 거절
    @Override
    @Transactional
    public void timecapsuleInviteReject(TimecapsuleInviteAcceptDTO timecapsuleInviteAcceptDTO) {
        // 현재 유저 꺼내옴
        Long userNo = getUserNo();
        User user = userRepository.findById(userNo).get();

        // 현재 타임캡슐을 꺼내옴
        Optional<Timecapsule> timecapsuleData = timecapsuleRepository.findById(timecapsuleInviteAcceptDTO.getTimecapsuleNo());
        // 타임캡슐이 존재하지 않으면
        if(timecapsuleData.isEmpty()){
            throw new CommonException(CustomExceptionStatus.NOT_TIMECAPSULE);
        }
        Timecapsule timecapsule = timecapsuleData.get();

        // 타임캡슐 초대를 꺼냄
        Optional<TimecapsuleInvite> timecapsuleInviteData = timecapsuleInviteRepository.getTimecapsuleInviteByTimecapsuleAndGuestUserNo(timecapsule, userNo);

        // 초대 데이터가 존재하지 않음
        if(timecapsuleInviteData.isEmpty()){
            throw new CommonException(CustomExceptionStatus.NOT_RECORD_INVITE);
        }

        TimecapsuleInvite timecapsuleInvite = timecapsuleInviteData.get();

        // 초대 데이터가 NOTREAD인지 판단
        if(timecapsuleInvite.getStatus().equals("ACCEPTED")){ // 이미 참여중
            throw new CommonException(CustomExceptionStatus.ALREADY_PARTICIPATING);
        }else if(timecapsuleInvite.getStatus().equals("REJECTED")){ // 이미 거절
            throw new CommonException(CustomExceptionStatus.NOT_RECORD_INVITE);
        }

        timecapsuleInvite.updateStatus("REJECTED");
        timecapsuleInviteRepository.save(timecapsuleInvite);
    }


    /*
        파일 사이즈 받기
     */
    @Override
    public Map<String, Object> timecapsuleFileSize(Long timecapsuleNo) {

        //유저
        Long userNo = getUserNo();
        User user = getUser(userNo);
        //타임캡슐
        Timecapsule timecapsule = getTimecapsule(timecapsuleNo);
        //캡슐 - 유저 맵핑
        TimecapsuleMapping myMapping = getTimecapsuleMapping(userNo, timecapsuleNo);

        Map<String, Object> fileInfo = new HashMap<>();
        fileInfo.put("maxFileSize", timecapsule.getMaxFileSize());
        fileInfo.put("nowFilesize", timecapsule.getNowFileSize());

        return fileInfo;
    }

    /*
        파일 업로드
     */
    @Override
    public Map<String, Object> timecapsuleFileUpload(MultipartFile file, Long timecapsuleNo) {

        //유저
        Long userNo = getUserNo();
        User user = getUser(userNo);
        //타임캡슐
        Timecapsule timecapsule = getTimecapsule(timecapsuleNo);
        //캡슐 - 유저 맵핑
        TimecapsuleMapping myMapping = getTimecapsuleMapping(userNo, timecapsuleNo);

        //오늘은 이미 파일업로드 하였습니다.
        if(myMapping.isFileAble() == false){
            throw new CommonException(CustomExceptionStatus.ALREADY_FILE_UPLOAD);
        }

        //log.info("fileSzie : {}" , file.getSize());
        //파일사이즈가 MaxFileSize보다 클경우 에러발생
        if( file.getSize() + timecapsule.getNowFileSize() > timecapsule.getMaxFileSize()){
            throw new CommonException(CustomExceptionStatus.FILE_LIMIT_NOT_UPLOAD);
        }

        String fileUrl = "";
        try {
            fileUrl = s3UploadService.fileSaveFile(file, timecapsuleNo);
        } catch (IOException e) {
            throw new  CommonException(CustomExceptionStatus.FILE_NOT_UPLOAD);
        }

        //파일값 저장
        TimecapsuleFile timecapsuleFile = new TimecapsuleFile();
        timecapsuleFile.createTimecapsuleFile(fileUrl, timecapsule, user, file);
        timecapsuleFileRepository.save(timecapsuleFile);

        //파일 저장했다고 세팅
        myMapping.updateFileAble(false);
        timecapsuleMappingRepository.save(myMapping);

        //파일 용량값 증가
        timecapsule.updateNowFileSize(timecapsule.getNowFileSize() + file.getSize());
        timecapsuleRepository.save(timecapsule);

        return null;
    }

    @Override
    public TimecapsuleSimpleDTO timecapsuleSimpleInfo(Long timecapsuleNo) {

        //유저
        Long userNo = getUserNo();
        User user = getUser(userNo);
        //타임캡슐
        Timecapsule timecapsule = getTimecapsule(timecapsuleNo);
        //캡슐 - 유저 맵핑
        TimecapsuleMapping myMapping = getTimecapsuleMapping(userNo, timecapsuleNo);

        //타임캡슐 (삭제 검증 ok)
        TimecapsuleSimpleDTO simpleDTO = timecapsule.toTimecapsuleSimpleDTO();

        List<TimecapsuleMapping> mappingList = timecapsuleMappingRepository.findNotSavedButDeleted(timecapsule.getTimecapsuleNo());
        if(mappingList.size() > 1) simpleDTO.setAlone(false);
        else simpleDTO.setAlone(true);

        return simpleDTO;
    }

    @Override
    public List<TimecapsuleOpenCardDTO> timecapsuleCardList(Long timecapsuleNo) {

        Long userNo = getUserNo();
        User user = getUser(userNo);
        Timecapsule timecapsule = getTimecapsule(timecapsuleNo);
        TimecapsuleMapping timecapsuleMapping = getTimecapsuleMapping(user.getUserNo(), timecapsule.getTimecapsuleNo());

        List<TimecapsuleOpenCardDTO> cardList = timecapsuleCardRepository.findByTimecapsuleTimecapsuleNo(timecapsule.getTimecapsuleNo())
                .stream()
                .map(TimecapsuleCard::toTimecapsuleOpenCardDTO).collect(Collectors.toList());

        //작성된 카드가 없는경우
        if(cardList.isEmpty()){
            throw new  CommonException(CustomExceptionStatus.NOT_CARD);
        }

        return cardList;
    }

    /*
        오픈 디테일
     */
    @Override
    public TimecapsuleOpenDetailDTO timecapsuleOpenDetail(Long timecapsuleNo) {

        Long userNo = getUserNo();
        User user = getUser(userNo);
        Timecapsule timecapsule = getTimecapsule(timecapsuleNo);
        TimecapsuleMapping timecapsuleMapping = getTimecapsuleMapping(user.getUserNo(), timecapsule.getTimecapsuleNo());

        TimecapsuleOpenDetailDTO openDetail = timecapsule.toTimecapsuleOpenDetailDTO();

        //삭제시간이 있다면
        if(timecapsuleMapping.getDeleteDate() != null){
            if(timecapsuleMapping.isSave())  throw new CommonException(CustomExceptionStatus.DELETE_TIMECAPSULE);
            else  throw new CommonException(CustomExceptionStatus.NOT_ALLOW_PARTICIPATE);
        }
        //isSave가 false 이면서 deleteDate가 있는거를 제외한 참가자 조회
        List<TimecapsuleMapping> participant = timecapsuleMappingRepository.findNotSavedButDeleted(timecapsuleNo);

        openDetail.setPartInfo(
                participant.stream().map(TimecapsuleMapping::toDetailPartInfoDTO)
                        .collect(Collectors.toList())
        );

        return openDetail;
    }

    @Override
    public Map<String, Object> timecapsuleOpenRank(Long timecapsuleNo) {

        Long userNo = getUserNo();
        User user = getUser(userNo);
        Timecapsule timecapsule = getTimecapsule(timecapsuleNo);
        TimecapsuleMapping timecapsuleMapping = getTimecapsuleMapping(user.getUserNo(), timecapsule.getTimecapsuleNo());

        TimecapsuleOpenDetailDTO openDetail = timecapsule.toTimecapsuleOpenDetailDTO();

        //삭제시간이 있다면
        if(timecapsuleMapping.getDeleteDate() != null){
            if(timecapsuleMapping.isSave())  throw new CommonException(CustomExceptionStatus.DELETE_TIMECAPSULE);
            else  throw new CommonException(CustomExceptionStatus.NOT_ALLOW_PARTICIPATE);
        }

        List<TimecapsuleMapping> openRankList = timecapsuleMappingRepository.findNotSavedButDeleted(timecapsuleNo);

        List<TimecapsuleOpenRankDTO> openRankDTOList = new ArrayList<>();
        for(TimecapsuleMapping openRank : openRankList){
           Long cardCnt = timecapsuleCardRepository.countByTimecapsuleTimecapsuleNoAndUserUserNo(timecapsuleNo, openRank.getUser().getUserNo());
           TimecapsuleOpenRankDTO rank = openRank.toTimecapsuleOpenRankDTO();
           rank.setCardCnt(Math.toIntExact(cardCnt));

            openRankDTOList.add(rank);
        }

        //정렬
        Collections.sort(openRankDTOList, (o1, o2) -> Integer.compare(o2.getCardCnt(), o1.getCardCnt()));

        Map<String,Object> result = new HashMap<>();
        result.put("userRank", openRankDTOList);
        result.put("allCardCnt", timecapsuleCardRepository.countByTimecapsuleTimecapsuleNo(timecapsuleNo));

        return  result;
    }

    /*
        타이캡슐 보관함 저장 로직
     */
    @Override
    @Transactional
    public void timecapsuleOpenSave(Long timecapsuleNo) {

        Long userNo = getUserNo();
        User user = getUser(userNo);
        Timecapsule timecapsule = getTimecapsule(timecapsuleNo);
        TimecapsuleMapping timecapsuleMapping = getTimecapsuleMapping(user.getUserNo(), timecapsule.getTimecapsuleNo());

        //보관함으로 저장
        timecapsuleMapping.updateIsSave(true);
        timecapsuleMapping.updateSaveDate(Timestamp.valueOf(LocalDateTime.now()));

    }


    /*
        타임캡슐 나가기
     */
    @Override
    public void timecapsuleExit(Long timecapsuleNo) {

        //유저
        Long userNo = getUserNo();
        User user = getUser(userNo);
        //타임캡슐
        Timecapsule timecapsule = getTimecapsule(timecapsuleNo);
        //캡슐 - 유저 맵핑
        TimecapsuleMapping timecapsuleMapping = getTimecapsuleMapping(userNo, timecapsuleNo);

        //만약 나가는 사람이 방장일경우 캡슐방 폭파
        if(timecapsuleMapping.isHost()){
            // 타임캡슐 초대 데이터 찾아서 REJECTED로 변경
            List<TimecapsuleInvite> timecapsuleInvites = timecapsuleInviteRepository.getTimecapsuleInviteByTimecapsule(timecapsule);
            for(TimecapsuleInvite ti : timecapsuleInvites){
                ti.updateStatus("REJECTED");
            }
            timecapsuleInviteRepository.saveAll(timecapsuleInvites);
            timecapsule.updateRemoveDate(Timestamp.valueOf(LocalDateTime.now()));

            // 타임 캡슐 참가자들의 매핑 테이블 삭제시간 추가
            List<TimecapsuleMapping> tmList = timecapsuleMappingRepository.findByIdNo(timecapsule.getTimecapsuleNo());
            // 타임캡슐 참가자들의 현재 개수 감소
            for(TimecapsuleMapping tm : tmList){
                User findUser = userRepository.findById(tm.getUser().getUserNo()).get();
                findUser.setNowCapsuleCount(findUser.getNowCapsuleCount() - 1);
                tm.updateDeleteDate(Timestamp.from(Instant.now()));
                userRepository.save(findUser);
            }

            timecapsuleMappingRepository.saveAll(tmList);

            return;

        }else{
            TimecapsuleInvite timecapsuleInvite = timecapsuleInviteRepository.getTimecapsuleInviteByTimecapsuleAndGuestUserNo(timecapsule, user.getUserNo()).get();
            timecapsuleInvite.updateStatus("REJECTED");
            timecapsuleInviteRepository.save(timecapsuleInvite);

            user.setNowCapsuleCount(user.getNowCapsuleCount() - 1);
            userRepository.save(user);
        }

        //참가자 감소(타임캡슐의 참가자 감소)
        timecapsule.updateNowParticipant(timecapsule.getNowParticipant() - 1);
        timecapsuleRepository.save(timecapsule);

        timecapsuleMapping.updateDeleteDate(Timestamp.valueOf(LocalDateTime.now()));
        timecapsuleMappingRepository.save(timecapsuleMapping);
    }
    
    /*
        타임캡슐 강퇴하기
     */
    @Override
    public void timecapsuleKick(Long timecapsuleNo, Long kickUserNo) {

        //유저
        Long userNo = getUserNo();
        User user = getUser(userNo);
        //타임캡슐
        Timecapsule timecapsule = getTimecapsule(timecapsuleNo);
        //캡슐 - 유저 맵핑
        TimecapsuleMapping userTimecapsule = getTimecapsuleMapping(userNo, timecapsuleNo);

        //강퇴하려는 유저
        User kickUser = userRepository.findByUserNo(kickUserNo).orElseThrow(
                () -> new CommonException(CustomExceptionStatus.KICK_NOT_USER)
        );

        //반장이 아닌경우
        if(userTimecapsule.isHost() == false){
            throw new CommonException(CustomExceptionStatus.NOT_TIMECAPSULE_HOST);
        }

        //강퇴하련느 유저
        TimecapsuleMapping kickUserMapping = timecapsuleMappingRepository.findByUserUserNoAndTimecapsuleTimecapsuleNo(
                kickUser.getUserNo(), timecapsule.getTimecapsuleNo()
        ).orElseThrow(
                () -> new CommonException(CustomExceptionStatus.KICKUSER_NOT_TIMECAPSULE)
        );

        //유저 타임캡슐 값 감소
        kickUser.setNowCapsuleCount(user.getNowCapsuleCount() - 1);
        userRepository.save(kickUser);

        // 타임캡슐 초대 데이터 찾아서 REJECTED로 변경
        TimecapsuleInvite timecapsuleInvite = timecapsuleInviteRepository.getTimecapsuleInviteByTimecapsuleAndGuestUserNo(timecapsule, kickUserNo).get();

        timecapsuleInvite.updateStatus("REJECTED");
        timecapsuleInviteRepository.save(timecapsuleInvite);

        //참가자 감소
        timecapsule.updateNowParticipant(timecapsule.getNowParticipant() - 1);
        timecapsuleRepository.save(timecapsule);

        //강퇴한 사람의 맵핑 삭제값 추가
        kickUserMapping.updateDeleteDate(Timestamp.valueOf(LocalDateTime.now()));
        timecapsuleMappingRepository.save(kickUserMapping);

    }


    /*
        타임캡슐 제거하기
     */
    @Override
    public void timecapsuleDelete(Long timecapsuleNo) {

        //유저
        Long userNo = getUserNo();
        User user = getUser(userNo);
        //타임캡슐
        Timecapsule timecapsule = getTimecapsule(timecapsuleNo);
        //캡슐 - 유저 맵핑
        TimecapsuleMapping userTimecapsule = getTimecapsuleMapping(userNo, timecapsuleNo);

        //반장이 아닌경우
        if(userTimecapsule.isHost() == false){
            throw new CommonException(CustomExceptionStatus.NOT_TIMECAPSULE_HOST);
        }

        //24시간 이내인가
        LocalDateTime registDate = timecapsule.getRegistDate().toLocalDateTime();
        LocalDateTime nowTime = LocalDateTime.now();

        //현재시간이 생성된지 24이후라면
        if(nowTime.isAfter(registDate.plusHours(24))){
            throw new CommonException(CustomExceptionStatus.NOT_DELTE_TIMECAPSULE);
        }

        // 타임캡슐 초대 데이터 찾아서 REJECTED로 변경
        List<TimecapsuleInvite> timecapsuleInvites = timecapsuleInviteRepository.getTimecapsuleInviteByTimecapsule(timecapsule);
        for(TimecapsuleInvite ti : timecapsuleInvites){
            ti.updateStatus("REJECTED");
        }
        timecapsuleInviteRepository.saveAll(timecapsuleInvites);

        // 타임 캡슐 참가자들의 매핑 테이블 삭제시간 추가
        List<TimecapsuleMapping> tmList = timecapsuleMappingRepository.findByIdNo(timecapsule.getTimecapsuleNo());
        // 타임캡슐 참가자들의 현재 개수 감소
        for(TimecapsuleMapping tm : tmList){
            User findUser = userRepository.findById(tm.getUser().getUserNo()).get();
            findUser.setNowCapsuleCount(findUser.getNowCapsuleCount() - 1);
            tm.updateDeleteDate(Timestamp.from(Instant.now()));
            userRepository.save(findUser);
            timecapsuleMappingRepository.save(tm);
        }

        timecapsule.updateRemoveDate(Timestamp.valueOf(LocalDateTime.now()));
        timecapsuleRepository.save(timecapsule);

    }

    public UserLocation renewWeather(WeatherLocationDTO weatherLocationDto, UserLocation userLocation){
        String weather = null;
        try {
            weather = weatherAPIService.getNowWeatherInfos(weatherLocationDto);
        } catch (Exception e) {
            throw new CommonException(CustomExceptionStatus.NOT_LOCATION_FIND);
        }
        //시간값 세팅
        userLocation.UpdateWeatherTime(Timestamp.valueOf(LocalDateTime.now()));
        //날씨 세팅
        userLocation.UpdateWeather(weather);
        UserLocation saveUserLocation = userLocationRepository.save(userLocation);

        return saveUserLocation;
    }

    public String createKey() {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        int length = 10;
        SecureRandom rnd = new SecureRandom();

        StringBuilder key = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            key.append(characters.charAt(rnd.nextInt(characters.length())));
        }

        return key.toString();
    }

}
