package com.b210.damda.domain.user.service;

import com.b210.damda.domain.dto.User.UserLoginSuccessDTO;
import com.b210.damda.domain.dto.User.UserOriginRegistDTO;
import com.b210.damda.domain.dto.User.UserSearchResultDTO;
import com.b210.damda.domain.dto.User.UserUpdateDTO;
import com.b210.damda.domain.entity.*;
import com.b210.damda.domain.entity.User.User;
import com.b210.damda.domain.entity.User.UserFriend;
import com.b210.damda.domain.entity.User.UserLog;
import com.b210.damda.domain.file.service.S3UploadService;
import com.b210.damda.domain.friend.repository.FriendRepository;
import com.b210.damda.domain.shop.repository.ItemsMappingRepository;
import com.b210.damda.domain.shop.repository.ItemsRepository;
import com.b210.damda.domain.shop.repository.ThemeMappingRepository;
import com.b210.damda.domain.shop.repository.ThemeRepository;
import com.b210.damda.domain.user.repository.UserLogRepository;
import com.b210.damda.domain.user.repository.UserRepository;
import com.b210.damda.util.JwtUtil;
import com.b210.damda.util.emailAPI.dto.TempCodeDTO;
import com.b210.damda.util.emailAPI.repository.EmailSendLogRepository;
import com.b210.damda.util.emailAPI.repository.SignupEmailLogRepository;
import com.b210.damda.util.exception.CommonException;
import com.b210.damda.util.exception.CustomExceptionStatus;
import com.b210.damda.util.refreshtoken.repository.RefreshTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class UserService {

    @Value("${jwt.secret}")
    private String secretKey;
    private UserRepository userRepository;
    private UserLogRepository userLogRepository;
    private final BCryptPasswordEncoder encoder;
    private RefreshTokenRepository refreshTokenRepository;
    private EmailSendLogRepository emailSendLogRepository;
    private FriendRepository friendRepository;
    private S3UploadService s3UploadService;
    private SignupEmailLogRepository signupEmailLogRepository;
    private ItemsMappingRepository itemsMappingRepository;
    private ItemsRepository itemsRepository;
    private ThemeMappingRepository themeMappingRepository;
    private ThemeRepository themeRepository;

    private static Long acExpiredMs = 1000 * 60 * 30L * (48 * 30); // 액세스 토큰의 만료 시간(30분) * 48 * 30 = 30일

    @Autowired
    public UserService(UserRepository userRepository, UserLogRepository userLogRepository, BCryptPasswordEncoder encoder, RefreshTokenRepository refreshTokenRepository,
                       EmailSendLogRepository emailSendLogRepository, FriendRepository friendRepository, S3UploadService s3UploadService, SignupEmailLogRepository signupEmailLogRepository,
                       ItemsMappingRepository itemsMappingRepository, ItemsRepository itemsRepository, ThemeMappingRepository themeMappingRepository,
                       ThemeRepository themeRepository) {
        this.userRepository = userRepository;
        this.userLogRepository = userLogRepository;
        this.encoder = encoder;
        this.refreshTokenRepository = refreshTokenRepository;
        this.emailSendLogRepository = emailSendLogRepository;
        this.friendRepository = friendRepository;
        this.s3UploadService = s3UploadService;
        this.signupEmailLogRepository = signupEmailLogRepository;
        this.itemsMappingRepository = itemsMappingRepository;
        this.itemsRepository = itemsRepository;
        this.themeMappingRepository = themeMappingRepository;
        this.themeRepository = themeRepository;
    }

    /*
        유저정보 불러오기
     */
    public Long getUserNo(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        Long userNo = (Long) principal;

        return userNo;
    }


    // 회원가입
    @Transactional
    public User regist(UserOriginRegistDTO userOriginRegistDTO, MultipartFile multipartFile) throws IOException {
        String fileUri = "";

        if(multipartFile.isEmpty() && multipartFile.getSize() == 0){
            fileUri = "https://damda.s3.ap-northeast-2.amazonaws.com/user-profileImage/profile.jpg";
        }else{
            fileUri = s3UploadService.profileSaveFile(multipartFile);
        }
        String encode = encoder.encode(userOriginRegistDTO.getUserPw()); // 비밀번호 암호화
        
        userOriginRegistDTO.setUserPw(encode);

        // 사진 경로 저장
        userOriginRegistDTO.setUri(fileUri);
        // 유저 데이터 저장
        User savedUser = userRepository.save(userOriginRegistDTO.toEntity());

        // 3번 아이템 꺼냄
        Items items = itemsRepository.findByItemNo(3L).get();

        // 스티커 무료 제공
        ItemsMapping itemsMapping = new ItemsMapping(savedUser, items);
        itemsMappingRepository.save(itemsMapping);

        // 1번 테마 꺼냄
        Theme theme = themeRepository.findById(1L).get();

        ThemeMapping themeMapping = new ThemeMapping(savedUser, theme);
        themeMappingRepository.save(themeMapping);

        return savedUser;
    }

    // 로그인
    @Transactional
    public UserLoginSuccessDTO login(String email, String password) {

        Optional<User> findUser = Optional.ofNullable(userRepository.findByEmail(email)
                .orElseThrow(() -> new CommonException(CustomExceptionStatus.USER_NOT_FOUND)));

        User user = findUser.get();

        // 이미 탈퇴한 유저
        if(user.getDeleteDate() != null){
            throw new CommonException(CustomExceptionStatus.USER_ALREADY_DEACTIVATED);
        }

        // 비밀번호 불일치
        if (!encoder.matches(password, user.getUserPw())){
            throw new CommonException(CustomExceptionStatus.NOT_MATCH_PASSWORD);
        }

        // 로그인 성공
        String accessToken = JwtUtil.createAccessJwt(user.getUserNo(), secretKey); // 토큰 발급해서 넘김

        String refreshToken = JwtUtil.createRefreshToken(secretKey); // 리프레시 토큰 발급해서 넘김

        Optional<RefreshToken> byUserUserNo = refreshTokenRepository.findByUserUserNo(user.getUserNo());

        // 리프레시 토큰 있는지 없는지 판단해서 저장
        if (byUserUserNo.isPresent()) {
            RefreshToken currentRefreshToken = byUserUserNo.get(); // 현재 유저의 리프레시 토큰 꺼내옴

            currentRefreshToken.setRefreshToken(refreshToken); // 전부 새롭게 저장
            currentRefreshToken.setExpirationDate(LocalDateTime.now().plusDays(14));
            currentRefreshToken.setCreateDate(LocalDateTime.now());

            refreshTokenRepository.save(currentRefreshToken); // db에 저장

        } else {
            RefreshToken refreshTokenUser = RefreshToken.builder() // 리프레시 토큰 빌더로 생성
                    .user(user)
                    .refreshToken(refreshToken)
                    .expirationDate(LocalDateTime.now().plusDays(14))
                    .build();

            refreshTokenRepository.save(refreshTokenUser); // 리프레시 토큰 저장.
        }

        UserLoginSuccessDTO response = UserLoginSuccessDTO.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .accountType("ORIGIN")
                .nickname(user.getNickname())
                .profileImage(user.getProfileImage())
                .userNo(user.getUserNo())
                .nowTheme(user.getNowTheme())
                .coin(user.getCoin())
                .expiredMs(acExpiredMs)
                .build();


        // 로그인 log 기록
        UserLog userLog = new UserLog();
        userLog.setUser(user);
        userLogRepository.save(userLog);

        return response;
    }

    // 유저 이메일 확인(이메일 존재하는지)
    public User fineByUser(String email) {
        Optional<User> byEmail = userRepository.findByEmail(email);
        if (byEmail.isEmpty()) {
            return null;
        }
        return byEmail.get();
    }

    // 로그아웃 처리
    @Transactional
    public void logout(String token) {
        String parsingToken = token.split(" ")[1];

        Optional<RefreshToken> byRefreshToken = refreshTokenRepository.findByRefreshToken(parsingToken);

        RefreshToken refreshToken = byRefreshToken.get(); // 유저의 리프레시 토큰 꺼냄.
        refreshToken.setRefreshToken("");
        RefreshToken save = refreshTokenRepository.save(refreshToken);
    }

    // 회원가입 인증번호 확인
    public int registCodeCheck(TempCodeDTO tempCodeDTO){
        String code = tempCodeDTO.getCode();
        String email = tempCodeDTO.getEmail();

        Optional<SignupEmailLog> topByEmailOrderByCreateTimeDesc = Optional.ofNullable(signupEmailLogRepository.findTopByEmailOrderByCreateTimeDesc(email)
                .orElseThrow(() -> new CommonException(CustomExceptionStatus.USER_NOT_FOUND)));

        SignupEmailLog signupEmailLog = topByEmailOrderByCreateTimeDesc.get();

        Map<String, Object> result = new HashMap<>();
        if(!signupEmailLog.getVerificationCode().equals(code)){ // 코드가 일치하지 않는 상태
            throw new CommonException(CustomExceptionStatus.NOT_MATCH_CODE);
        }else{
            if(signupEmailLog.getExpiryTime().isBefore(LocalDateTime.now())){ // 만료가 됐으면
                throw new CommonException(CustomExceptionStatus.EXPIRE_CODE);
            }else{ // 만료시간이 지나지 않은 상태
                if(signupEmailLog.getVerificationCode().equals(tempCodeDTO.getCode()) && !signupEmailLog.isUsed()){ // 코드가 일치하고 사용하지 않은 상태
                    signupEmailLog.setUsed(true);
                    signupEmailLogRepository.save(signupEmailLog);
                    return 1;
                }else{ // 코드가 일치하지만 사용한 상태
                    throw new CommonException(CustomExceptionStatus.ALREADY_USED_CODE);
                }
            }
        }
    }

    // 비밀번호 변경 인증번호 확인
    @Transactional
    public void tempCodeCheck(TempCodeDTO tempCodeDTO) {
        String email = tempCodeDTO.getEmail();
        String code = tempCodeDTO.getCode();
        
        // 회원이 없음
        Optional<User> byEmail = Optional.ofNullable(userRepository.findByEmail(email).
                orElseThrow(() -> new CommonException(CustomExceptionStatus.USER_NOT_FOUND)));
        
        User user = byEmail.get();

        Long userNo = user.getUserNo();

        EmailSendLog emailSendLog = emailSendLogRepository.findTopByUserUserNoOrderByCreateTimeDesc(userNo);

        if(!emailSendLog.getVerificationCode().equals(code)){ // 코드가 일치하지 않는 상태
            throw new CommonException(CustomExceptionStatus.NOT_MATCH_CODE);
        }else{
            if(emailSendLog.getExpiryTime().isBefore(LocalDateTime.now())){ // 만료시간이 지난 상태
                throw new CommonException(CustomExceptionStatus.EXPIRE_CODE);
            }else{ // 만료시간이 지나지 않은 상태
                if(emailSendLog.getVerificationCode().equals(code) && !emailSendLog.isUsed()){ // 코드가 일치하고 사용하지 않은 상태
                    emailSendLog.setUsed(true);
                    emailSendLogRepository.save(emailSendLog);
                }else{ // 코드가 일치하지만 사용한 상태
                    throw new CommonException(CustomExceptionStatus.ALREADY_USED_CODE);
                }
            }
        }
    }

    // 유저 비밀번호 재설정
    @Transactional
    public void newPassword(UserUpdateDTO userUpdateDTO){
        String email = userUpdateDTO.getEmail();
        String userPw = userUpdateDTO.getUserPw();

        Optional<User> byEmail = Optional.ofNullable(userRepository.findByEmail(email)
                .orElseThrow(() -> new CommonException(CustomExceptionStatus.USER_NOT_FOUND)));

        User user = byEmail.get();

        if(encoder.matches(userPw, user.getUserPw())){
            throw new CommonException(CustomExceptionStatus.SAME_PASSWORD);
        }

        user.updatePassword(encoder.encode(userPw));
        userRepository.save(user);
    }

    // 비밀번호 확인
    public User passwordCheck(String password){

        Long userNo = getUserNo();

        Optional<User> byId = Optional.ofNullable(userRepository.findById(userNo)
                .orElseThrow(() -> new CommonException(CustomExceptionStatus.USER_NOT_FOUND)));

        User user = byId.get();

        if(!encoder.matches(password, user.getUserPw())){
            throw new CommonException(CustomExceptionStatus.NOT_MATCH_PASSWORD);
        }

        return user;
    }


    // 회원 검색
    public List<UserSearchResultDTO> userSearch(String query, String type){

        Long userNo = getUserNo(); // 현재 액세스 토큰의 유저pk

        List<UserSearchResultDTO> result = new ArrayList<>();

        if(type.equals("nickname")){ // 닉네임으로 검색
            // 검색값, 로그인유저의 값으로 검색 -> 현재 로그인 유저의 값은 제외한 유저 리스트 뽑음
            List<User> byNicknameContaining = userRepository.findByNicknameContainingAndUserNoNot(query, userNo);

            if(byNicknameContaining.isEmpty()){ // 유저가 없으면
                return result;
            }

            // 현재 유저 꺼냄
            User currentUser = userRepository.findByUserNo(userNo)
                    .orElseThrow(
                            () -> new CommonException(CustomExceptionStatus.NOT_USER)
                    );

            // 현재 유저의 친구 목록을 전부 꺼냄
            List<UserFriend> userFriendByUser = friendRepository.getUserFriendByUser(currentUser);

            for(User searchUser : byNicknameContaining){
                boolean isFriend = false;
                for(UserFriend userFriend : userFriendByUser){
                    if(userFriend.getFriend().getUserNo() == searchUser.getUserNo()){
                        UserSearchResultDTO searchResultDTO = new UserSearchResultDTO(searchUser, userFriend);
                        result.add(searchResultDTO);
                        isFriend = true;
                        break;
                    }
                }
                if(!isFriend){
                    UserSearchResultDTO searchResultDTO = new UserSearchResultDTO();
                    searchResultDTO.createSearchResultDTO(searchUser);
                    result.add(searchResultDTO);
                }
            }

            return result;

        }else if(type.equals("code")){ // 코드로 검색
            long targetNo = Long.parseLong(query.replace("#", "")); // #을 빈공백으로 바꾸고 롱으로 전환
            User targetUser = userRepository.findByUserNoAndDeleteDateIsNull(targetNo);

            if(targetUser != null && targetUser.getUserNo() == userNo){ // 검색한 유저의 번호가 나와 같으면 리턴
                return result;
            }
            else if(targetUser != null){ // 유저가 있으면
                UserSearchResultDTO userSearchResultDTO = null;
                // 현재 유저 꺼냄
                User currentUser = userRepository.findByUserNo(userNo)
                        .orElseThrow(
                                () -> new CommonException(CustomExceptionStatus.NOT_USER)
                        );

                // 검색 코드로 해당 유저 찾음
                if(targetUser == null){
                    return result;
                }

                // 현재 유저의 친구목록을 하나 꺼냄
                UserFriend uf = friendRepository.getUserFriendByUserANDFriendNo(currentUser, targetNo);

                if(uf == null){
                    userSearchResultDTO = new UserSearchResultDTO();
                    userSearchResultDTO.createSearchResultDTO(targetUser);

                }else{
                    userSearchResultDTO = new UserSearchResultDTO(targetUser, uf);
                }
                result.add(userSearchResultDTO);
            }else{ // 유저가 없으면
                return result;
            }

            return result;
        }else{ // 닉네임#코드로 검색
            String[] parts = query.split("#");
            if(parts.length < 2){
                throw new CommonException(CustomExceptionStatus.BAD_QUERY_FORMAT);
            }
            long targetNo = Long.parseLong(parts[1]); // 코드
            String targetNickname = parts[0]; // 닉네임

            User targetUser = userRepository.findByUserNoAndDeleteDateIsNull(targetNo);// 코드로 검색한 유저의 정보

            if(targetUser != null && targetUser.getUserNo() == userNo){ // 코드로 검색한 유저가 존재하고 그 유저가 나와 같다면
                return result;
            }else if(targetUser != null){
                User currentUser = userRepository.findById(userNo).get(); // 현재 로그인 유저의 정보

                // 해당 유저의 닉네임과 검색어로 받은 닉네임과 코드가 일치하면
                if(targetUser.getNickname().equals(targetNickname) && targetUser.getUserNo() == targetNo){
                    UserFriend friendUser = friendRepository.getUserFriendByUserAndFriend(currentUser, targetUser);// 현재 로그인 유저의 친구 목록 하나 가져옴
                    UserSearchResultDTO resultDTO = null;

                    if(friendUser == null){
                        resultDTO.createSearchResultDTO(targetUser);
                    }else{
                        resultDTO = new UserSearchResultDTO(targetUser, friendUser);
                    }
                    result.add(resultDTO);
                }
            }
        }
        return result;
    }

    @Transactional
    // 유저 정보 업데이트
    public User userInfoUpdate(UserUpdateDTO userUpdateDTO, MultipartFile multipartFile) throws IOException {
        Long userNo = getUserNo();

        Optional<User> byId = Optional.ofNullable(userRepository.findById(userNo)
                .orElseThrow(() -> new CommonException(CustomExceptionStatus.USER_NOT_FOUND)));

        User user = byId.get();

        if(!multipartFile.isEmpty()){
            String uri = s3UploadService.profileSaveFile(multipartFile);
            user.updateprofileImage(uri);
        }

        if(!userUpdateDTO.getUserPw().equals("")){
            String encode = encoder.encode(userUpdateDTO.getUserPw());
            user.updatePassword(encode);
        }

        user.updateNickname(userUpdateDTO.getNickname());
        User save = userRepository.save(user);
        return save;
    }

    @Transactional
    public void userWithdrawal(){
        Long userNo = getUserNo();

        Optional<User> byId = Optional.ofNullable(userRepository.findById(userNo)
                .orElseThrow(() -> new CommonException(CustomExceptionStatus.USER_NOT_FOUND)));

        User user = byId.get();

        Optional<RefreshToken> byUserUserNo = refreshTokenRepository.findByUserUserNo(user.getUserNo());

        RefreshToken refreshToken = byUserUserNo.get();
        refreshToken.setRefreshToken("");
        refreshTokenRepository.save(refreshToken);

        user.insertDeleteDate();
        userRepository.save(user);
    }
}
