package com.b210.damda.domain.user.service;

import com.b210.damda.domain.dto.UserOriginRegistDTO;
import com.b210.damda.domain.dto.UserSearchResultDTO;
import com.b210.damda.domain.dto.UserUpdateDTO;
import com.b210.damda.domain.entity.*;
import com.b210.damda.domain.friend.repository.FriendRepository;
import com.b210.damda.domain.user.repository.UserLogRepository;
import com.b210.damda.domain.user.repository.UserRepository;
import com.b210.damda.util.JwtUtil;
import com.b210.damda.util.emailAPI.dto.TempCodeDTO;
import com.b210.damda.util.emailAPI.repository.EmailSendLogRepository;
import com.b210.damda.util.refreshtoken.repository.RefreshTokenRepository;
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

    @Autowired
    public UserService(UserRepository userRepository, UserLogRepository userLogRepository, BCryptPasswordEncoder encoder, RefreshTokenRepository refreshTokenRepository,
                       EmailSendLogRepository emailSendLogRepository, FriendRepository friendRepository) {
        this.userRepository = userRepository;
        this.userLogRepository = userLogRepository;
        this.encoder = encoder;
        this.refreshTokenRepository = refreshTokenRepository;
        this.emailSendLogRepository = emailSendLogRepository;
        this.friendRepository = friendRepository;
    }


    // 회원가입
    @Transactional
    public User regist(UserOriginRegistDTO userOriginRegistDTO, String profileUri) {
        String encode = encoder.encode(userOriginRegistDTO.getUserPw()); // 비밀번호 암호화

        userOriginRegistDTO.setUserPw(encode);
        if (profileUri.equals("")) {
            userOriginRegistDTO.setUri("profile.jpg");
            User savedUser = userRepository.save(userOriginRegistDTO.toEntity());
            return savedUser;
        } else {
            userOriginRegistDTO.setUri(profileUri);
            User savedUser = userRepository.save(userOriginRegistDTO.toEntity());
            return savedUser;
        }

    }

    // 로그인
    @Transactional
    public Map<String, String> login(String email, String password) {
        Optional<User> findUser = userRepository.findByEmail(email);
        Map<String, String> tokens = new HashMap<>();

        // 유저의 이메일이 없음
        if (findUser.isEmpty()) {
            tokens.put("error", "no email");
            return tokens;
        }

        if (!encoder.matches(password, findUser.get().getUserPw())) {
            tokens.put("error", "no password");
            return tokens;
        }
        User user = findUser.get();

        // 로그인 성공
        String accessToken = JwtUtil.createAccessJwt(user.getUserNo(), secretKey); // 토큰 발급해서 넘김
        String refreshToken = JwtUtil.createRefreshToken(secretKey); // 리프레시 토큰 발급해서 넘김

        Optional<RefreshToken> byUserUserNo = refreshTokenRepository.findByUserUserNo(user.getUserNo());
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


        tokens.put("accessToken", accessToken);
        tokens.put("refreshToken", refreshToken);

        // 로그인 log 기록
        UserLog userLog = new UserLog();
        userLog.setUser(user);
        userLogRepository.save(userLog);

        return tokens;
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
    public int logout(String token) {
        String parsingToken = token.split(" ")[1];
        Optional<RefreshToken> byRefreshToken = refreshTokenRepository.findByRefreshToken(parsingToken);
        RefreshToken refreshToken = byRefreshToken.get(); // 유저의 리프레시 토큰 꺼냄.
        refreshToken.setRefreshToken("");
        RefreshToken save = refreshTokenRepository.save(refreshToken);

        if (save.getRefreshToken().equals("")) { //리프레시 토큰이 만료됐으면
            return 1;
        } else { // 리프레시 토큰 만료 실패했으면
            return 0;
        }
    }

    // 유저 인증번호 확인
    public int tempCodeCheck(TempCodeDTO tempCodeDTO) {
        String email = tempCodeDTO.getEmail();
        String code = tempCodeDTO.getCode();
        Optional<User> byEmail = userRepository.findByEmail(email);
        User user = byEmail.get();

        Long userNo = user.getUserNo();

        Optional<EmailSendLog> topByUserUserNoOrderByCreateTimeDesc = emailSendLogRepository.findTopByUserUserNoOrderByCreateTimeDesc(userNo);
        EmailSendLog emailSendLog = topByUserUserNoOrderByCreateTimeDesc.get();
        if(!emailSendLog.getVerificationCode().equals(code)){ // 코드가 일치하지 않는 상태
            return 4;
        }else{
            if(emailSendLog.getExpiryTime().isBefore(LocalDateTime.now())){ // 만료시간이 지난 상태
                return 1;
            }else{ // 만료시간이 지나지 않은 상태
                if(emailSendLog.getVerificationCode().equals(code) && !emailSendLog.isUsed()){ // 코드가 일치하고 사용하지 않은 상태
                    emailSendLog.setUsed(true);
                    emailSendLogRepository.save(emailSendLog);
                    return 2;
                }else{ // 코드가 일치하지만 사용한 상태
                    return 3;
                }
            }
        }
    }

    // 유저 비밀번호 재설정
    @Transactional
    public int newPassword(UserUpdateDTO userUpdateDTO){
        String email = userUpdateDTO.getEmail();
        String userPw = userUpdateDTO.getUserPw();

        Optional<User> byEmail = userRepository.findByEmail(email);
        if(byEmail.isEmpty()){
            return 1;
        }else{
            User user = byEmail.get();
            if(user.getUserPw().equals(userPw)){
                return 2;
            }
            user.updatePassword(userPw);
            userRepository.save(user);
            return 3;
        }
    }

    // 비밀번호 확인
    public int passwordCheck(String password){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        Long userNo = (Long) principal;
        Optional<User> byId = userRepository.findById(userNo);
        if(byId.isEmpty()){ // 해당 유저가 없음
            return 1;
        }else{
            User user = byId.get();
            if(encoder.matches(password, user.getUserPw())){ // 비밀번호 일치하면
                return 2;
            }else { // 비밀번호 일치하지 않으면
                return 3;
            }
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
}
