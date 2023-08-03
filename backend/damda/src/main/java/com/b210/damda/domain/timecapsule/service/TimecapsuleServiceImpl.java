package com.b210.damda.domain.timecapsule.service;

import com.b210.damda.domain.dto.Timecapsule.*;
import com.b210.damda.domain.dto.weather.WeatherDTO;
import com.b210.damda.domain.dto.weather.WeatherLocationDTO;
import com.b210.damda.domain.entity.Timecapsule.*;
import com.b210.damda.domain.entity.User.User;
import com.b210.damda.domain.timecapsule.repository.*;
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

import java.security.SecureRandom;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.*;
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

    //날씨 서비스 접근
    private final WeatherLocationService weatherLocationService;

    private final int MAX_PARTICIOPANT = 10;
    private final Long MAX_FILESIZE = 100L;
    /*
        유저 정보 불러오기
     */
    public Long getUserNo(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        Long userNo = (Long) principal;

        return userNo;
    }

    /*
        타임캡슐 리스트 받아오기
     */
    @Override
    public Map<String,List<TimecapsuleMapping>> getTimecapsuleList(Long userNo){
        List<TimecapsuleMapping> timecapsules = timecapsuleMappingRepository.findByUserUserNo(userNo);

        //타임캡슐이 있는지?
        if(timecapsules.size() < 1){
            throw new CommonException(CustomExceptionStatus.NOT_TIMECAPSULE);
        }
        //진행중인 타임캡슐
        List<TimecapsuleMapping> workTimecapsules = new ArrayList<>();
        //저장된 타임캡슐
        List<TimecapsuleMapping> saveTimecapsules = new ArrayList<>();

        for(TimecapsuleMapping timecapsule : timecapsules){
            //캡슐이 와전히 삭되었거나, 캡슐저장을 삭제한경우 넘어가라
            if(timecapsule.getTimecapsule().getRemoveDate() != null ||
                timecapsule.getDeleteDate() != null) continue;
            if( timecapsule.isSave() == false) workTimecapsules.add(timecapsule);
            else saveTimecapsules.add(timecapsule);
        }

        Map<String,List<TimecapsuleMapping>> allTimecapsuleList = new HashMap<>();
        allTimecapsuleList.put("workTimecapsules", workTimecapsules);
        allTimecapsuleList.put("saveTimecapsules", saveTimecapsules);

        return allTimecapsuleList;
    }

    /*
        메인화면 타임캡슐 리스트 불러오기
     */
    @Override
    public List<MainTimecapsuleListDTO> workTimecapsule(WeatherDTO weatherDto) {
        Long userNo = getUserNo();
        log.info(userNo.toString());
        Map<String,List<TimecapsuleMapping>> allTimecapsuleList = getTimecapsuleList(userNo);

        List<TimecapsuleMapping> workTimecapsules = allTimecapsuleList.get("workTimecapsules");

        //진행중인 타임캡슐이 없다면
        if(workTimecapsules.size() < 1){
            throw new CommonException(CustomExceptionStatus.NOT_WORK_TIMECAPSULE);
        }

        List<MainTimecapsuleListDTO> timecapsuleList = new ArrayList<>();
        for(TimecapsuleMapping timecapsule : workTimecapsules){
            MainTimecapsuleListDTO mainTimecapsule = timecapsule.getTimecapsule().toMainTimecapsuleListDTO();
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
                if(timecapsuleCriteria.getWeatherStatus() != null || timecapsuleCriteria.getLocalBig() != null) {
                    weatherDto.setMode(true);
                    WeatherLocationDTO location = null;
                    //현재 위치값 받기
                    try { location = weatherLocationService.getNowLocation(weatherDto); } 
                    catch (Exception e) { throw new CommonException(CustomExceptionStatus.NOT_LOCATION_FIND); }
                    
                    //위치가 있을경우
                    if (timecapsuleCriteria.getLocalBig() != null) {   
                        //LocalBig과 LocalMedium 이 같지 않으면 오픈 조건 미성립!
                        if(timecapsuleCriteria.getLocalBig().equals(location.getLocalBig()) && 
                            timecapsuleCriteria.getLocalMedium().equals(location.getLocalMedium())) continue;
                        else openAble = false;
                    }
                    //날씨가 있는 경우
                    if(timecapsuleCriteria.getWeatherStatus() != null){
                        //추후 추가예정
                    }

                }
                //시간 조건 확인 (한국)
                ZoneId seoulZoneId = ZoneId.of("Asia/Seoul");
                ZonedDateTime seoulTime = LocalDateTime.now().atZone(seoulZoneId);
                //캡슐 오픈 날짜
                ZonedDateTime openDate = timecapsule.getTimecapsule().getOpenDate()
                        .toLocalDateTime().atZone(seoulZoneId);

                //날짜가 지났다면 (날짜만 비교 LocalDate)
                if(seoulTime.toLocalDate().isAfter(openDate.toLocalDate())){
                    //시간을 설정했고 그 설정한시간보다 전이라면
                    if( timecapsule.getTimecapsule().getTimecapsuleCriteria().getStartTime() != null
                            && seoulTime.getHour() < timecapsule.getTimecapsule()
                            .getTimecapsuleCriteria().getStartTime()) openAble = false;
                    else continue;
                }else openAble = false;

                //모든 조건이 지나긴후
                mainTimecapsule.setState(openAble);

            }
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

        Map<String,List<TimecapsuleMapping>> allTimecapsuleList = getTimecapsuleList(userNo);
        List<TimecapsuleMapping> saveTimecapsules = allTimecapsuleList.get("saveTimecapsules");

        //저장된 타임캡슐이 없는경우
        if(saveTimecapsules.size() < 1){
            throw new CommonException(CustomExceptionStatus.NOT_SAVE_TIMECAPSULE);
        }

        /*
            저장된 타임캡슐 DTO 변화 및 타입이 GOAL 이면 OPENDATE 받아온다
         */
        List<SaveTimecapsuleListDTO> saveTimecapsuleList = new ArrayList<>();
        for(TimecapsuleMapping timecapsuleMapping : saveTimecapsules){
            Timecapsule timecapsule = timecapsuleMapping.getTimecapsule();
            SaveTimecapsuleListDTO saveTimecapsule = timecapsule.toSaveTimecapsuleListDTO();
            if(saveTimecapsule.getType().equals("GOAL")) {
                saveTimecapsule.setEndDate(timecapsuleMapping.getOpenDate());
            }
            saveTimecapsuleList.add(saveTimecapsule);
        }

        return saveTimecapsuleList;
    }

    @Override
    public Long createTimecapsule(TimecapsuleCreateDTO timecapsuleCreateDTO) {

        Long userNo = getUserNo();
        //타임캡슐 생성 불가 로직
        User user = userRepository.findByUserNo(userNo).orElseThrow(
                () -> new CommonException(CustomExceptionStatus.NOT_USER));

        if(user.getMaxCapsuleCount() <= user.getNowCapsuleCount()){
            throw new CommonException(CustomExceptionStatus.NOT_CREATE_TIMECAPSULE_USERLIMIT);
        }

         //DTO Entitiy 변환
         Timecapsule createTimecapsule = timecapsuleCreateDTO.toEntity();

         //타임캡슐 추가 기본값 세팅
         createTimecapsule.setRegistDate(
                 Timestamp.valueOf(LocalDateTime.now().withSecond(0).withNano(0))
         );
         createTimecapsule.setMaxFileSize(MAX_FILESIZE);
         createTimecapsule.setMaxParticipant(MAX_PARTICIOPANT);
         createTimecapsule.setInviteCode(createKey());
         createTimecapsule.setCapsuleIconNo(new Random().nextInt(10));

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
                        cirteriaDay.setTimecapsuleCriteria(saveTimecapsule.getTimecapsuleCriteria());
                        cirteriaDay.setDayEn(cardDay);
                        cirteriaDay.setDayKor(dayKr);
                        CirteriaDay saveCirteriaDay = cirteriaDayRepository.save(cirteriaDay);
                        // 요일 저장 에러 발생
                        if(saveCirteriaDay.getDayNo() == null) {
                            throw new CommonException(CustomExceptionStatus.CREATE_CIRTERIADAY);
                        }
                    }
                }
             }
         }

         //타임캡슐 유저 맵핑
         TimecapsuleMapping timecapsuleMapping = new TimecapsuleMapping();
         timecapsuleMapping.setUser(userRepository.findByUserNo(userNo).orElseThrow(
                 () -> new CommonException(CustomExceptionStatus.NOT_USER)));
         timecapsuleMapping.setTimecapsule(saveTimecapsule);
         timecapsuleMapping.setHost(true);

         // 저장
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

    @Override
    public TimecapsuleDetailDTO getTimecapsuleDetail(Long timecapsuleNo){
        Long userNo = getUserNo();

        //유저
        User user = userRepository.findByUserNo(userNo).orElseThrow(
                () -> new CommonException(CustomExceptionStatus.NOT_USER)
        );

        //타임캡슐
        Timecapsule timecapsule = timecapsuleRepository.findById(timecapsuleNo).orElseThrow(
                () -> new CommonException(CustomExceptionStatus.NOT_TIMECAPSULE)
        );

        //캡슐 - 유저 매핑된게 아니라면
        TimecapsuleMapping myMapping = timecapsuleMappingRepository
                .findByUserUserNoAndTimecapsuleTimecapsuleNo(userNo, timecapsuleNo)
                .orElseThrow(
                        () -> new CommonException(CustomExceptionStatus.USER_NOT_TIMECAPSULE)
                );

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

        return timecapsuleDetail;
    }


    public String createKey() {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        int length = 6;
        SecureRandom rnd = new SecureRandom();

        StringBuilder key = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            key.append(characters.charAt(rnd.nextInt(characters.length())));
        }

        return key.toString();
    }


}
