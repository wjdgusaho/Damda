package com.b210.damda.domain.user.service;

import com.b210.damda.domain.dto.UserOriginRegistDTO;
import com.b210.damda.domain.dto.UserSearchResultDTO;
import com.b210.damda.domain.dto.UserUpdateDTO;
import com.b210.damda.domain.entity.*;
import com.b210.damda.domain.file.service.FileStoreService;
import com.b210.damda.domain.friend.repository.FriendRepository;
import com.b210.damda.domain.user.repository.UserLogRepository;
import com.b210.damda.domain.user.repository.UserRepository;
import com.b210.damda.util.JwtUtil;
import com.b210.damda.util.emailAPI.dto.TempCodeDTO;
import com.b210.damda.util.emailAPI.repository.EmailSendLogRepository;
import com.b210.damda.util.emailAPI.repository.SignupEmailLogRepository;
import com.b210.damda.util.exception.CommonException;
import com.b210.damda.util.exception.CustomExceptionStatus;
import com.b210.damda.util.refreshtoken.repository.RefreshTokenRepository;
import com.b210.damda.util.response.DataResponse;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.parameters.P;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

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
    private FileStoreService fileStoreService;
    private SignupEmailLogRepository signupEmailLogRepository;

    @Autowired
    public UserService(UserRepository userRepository, UserLogRepository userLogRepository, BCryptPasswordEncoder encoder, RefreshTokenRepository refreshTokenRepository,
                       EmailSendLogRepository emailSendLogRepository, FriendRepository friendRepository, FileStoreService fileStoreService, SignupEmailLogRepository signupEmailLogRepository) {
        this.userRepository = userRepository;
        this.userLogRepository = userLogRepository;
        this.encoder = encoder;
        this.refreshTokenRepository = refreshTokenRepository;
        this.emailSendLogRepository = emailSendLogRepository;
        this.friendRepository = friendRepository;
        this.fileStoreService = fileStoreService;
        this.signupEmailLogRepository = signupEmailLogRepository;
    }


    // 회원가입
    @Transactional
    public User regist(UserOriginRegistDTO userOriginRegistDTO, MultipartFile multipartFile) {
        String fileUri = "";

        if(multipartFile.isEmpty() && multipartFile.getSize() == 0){
            fileUri = "profile.jpg";
        }else{
            fileUri = fileStoreService.storeFile(multipartFile);
        }
        String encode = encoder.encode(userOriginRegistDTO.getUserPw()); // 비밀번호 암호화

        userOriginRegistDTO.setUserPw(encode);
        if (fileUri.equals("profile.jpg")) {
            userOriginRegistDTO.setUri("profile.jpg");
            User savedUser = userRepository.save(userOriginRegistDTO.toEntity());
            return savedUser;
        } else {
            userOriginRegistDTO.setUri(fileUri);
            User savedUser = userRepository.save(userOriginRegistDTO.toEntity());
            return savedUser;
        }
    }

    // 로그인
    @Transactional
    public Map<String, Object> login(String email, String password) {

        Optional<User> findUser = Optional.ofNullable(userRepository.findByEmail(email)
                .orElseThrow(() -> new CommonException(CustomExceptionStatus.EMAIL_NOT_FOUND)));

        User user = findUser.get();

        // 비밀번호 불일치
        if (!encoder.matches(password, user.getUserPw())){
            throw new CommonException(CustomExceptionStatus.NOT_MATCH_PASSWORD);
        }

        // 이미 탈퇴한 유저
        if(user.getDeleteDate() != null){
            throw new CommonException(CustomExceptionStatus.USER_ALREADY_DEACTIVATED);
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

        Map<String, Object> response = new HashMap<>();

        response.put("accessToken", accessToken);
        response.put("refreshToken", refreshToken);

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
    public void passwordCheck(String password){

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        Long userNo = (Long) principal;

        Optional<User> byId = Optional.ofNullable(userRepository.findById(userNo)
                .orElseThrow(() -> new CommonException(CustomExceptionStatus.USER_NOT_FOUND)));

        User user = byId.get();

        if(!encoder.matches(password, user.getUserPw())){
            throw new CommonException(CustomExceptionStatus.NOT_MATCH_PASSWORD);
        }
    }


    // 회원 검색
    public List<UserSearchResultDTO> userSearch(String query, String type){

        List<UserSearchResultDTO> result = new ArrayList<>();
        List<User> users = new ArrayList<>();

        if(type.equals("nickname")){ // 닉네임으로 검색
            users = userRepository.findByNicknameContaining(query);
        }else if(type.equals("code")){ // 코드로 검색
            long userNo = Long.parseLong(query);
            Optional<User> byId = userRepository.findById(userNo);
            if(byId.isEmpty()){ // 유저가 없으면
                return result;
            }else{ // 유저가 있으면
                User user = byId.get();
                users.add(user);
            }
        }else{ // 닉네임#코드로 검색
            String[] parts = query.split("#");
            long userNo = Long.parseLong(parts[0]);
            Optional<User> byId = userRepository.findById(userNo);
            if(byId.isEmpty()){ // 코드와 일치하는 유저가 없으면
                return result;
            }else{ // 코드와 일치하는 유저가 있으면
                User user = byId.get();
                if(user.getNickname().equals(parts[0])){ // 코드의 유저와 닉네임이 같으면
                    users.add(user);
                }else{ // 코드의 유저와 닉네임이 다르면
                    return result;
                }
            }
        }

        for(User user : users){
            Optional<userFriend> userFriendByUser = friendRepository.getUserFriendByUser(user);
            if (userFriendByUser.isPresent()) {
                UserSearchResultDTO results = new UserSearchResultDTO(user, userFriendByUser.get());
                result.add(results);
            }
        }
        return result;
    }

    @Transactional
    // 유저 정보 업데이트
    public void userInfoUpdate(UserUpdateDTO userUpdateDTO, MultipartFile multipartFile){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        Long userNo = (Long) principal;

        Optional<User> byId = Optional.ofNullable(userRepository.findById(userNo)
                .orElseThrow(() -> new CommonException(CustomExceptionStatus.USER_NOT_FOUND)));

        User user = byId.get();

        if(!multipartFile.isEmpty()){
            String uri = fileStoreService.storeFile(multipartFile);
            user.updateprofileImage(uri);
        }

        if(!userUpdateDTO.getUserPw().equals("")){
            String encode = encoder.encode(userUpdateDTO.getUserPw());
            user.updatePassword(encode);
        }

        user.updateNickname(userUpdateDTO.getNickname());
        userRepository.save(user);
    }

    @Transactional
    public void userWithdrawal(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        Long userNo = (Long) principal;

        Optional<User> byId = Optional.ofNullable(userRepository.findById(userNo)
                .orElseThrow(() -> new CommonException(CustomExceptionStatus.USER_NOT_FOUND)));

        User user = byId.get();

        RefreshToken referenceById = refreshTokenRepository.getReferenceById(user.getUserNo());

        referenceById.setRefreshToken("");
        refreshTokenRepository.save(referenceById);

        user.insertDeleteDate();
        userRepository.save(user);
    }
}
