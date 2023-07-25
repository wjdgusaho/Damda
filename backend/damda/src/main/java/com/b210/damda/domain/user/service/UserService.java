package com.b210.damda.domain.user.service;

import com.b210.damda.domain.dto.UserOriginRegistDTO;
import com.b210.damda.domain.dto.UserUpdateDTO;
import com.b210.damda.domain.entity.EmailSendLog;
import com.b210.damda.domain.entity.RefreshToken;
import com.b210.damda.domain.entity.User;
import com.b210.damda.domain.entity.UserLog;
import com.b210.damda.domain.repository.RefreshTokenRepository;
import com.b210.damda.domain.user.filter.JwtFilter;
import com.b210.damda.domain.user.repository.UserLogRepository;
import com.b210.damda.domain.user.repository.UserRepository;
import com.b210.damda.util.JwtUtil;
import com.b210.damda.util.emailAPI.dto.TempCodeDTO;
import com.b210.damda.util.emailAPI.repository.EmailSendLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class UserService {

    @Value("${jwt.secret}")
    private String secretKey;
    private UserRepository userRepository;
    private UserLogRepository userLogRepository;
    private final BCryptPasswordEncoder encoder;
    private RefreshTokenRepository refreshTokenRepository;
    private EmailSendLogRepository emailSendLogRepository;

    @Autowired
    public UserService(UserRepository userRepository, UserLogRepository userLogRepository, BCryptPasswordEncoder encoder, RefreshTokenRepository refreshTokenRepository,
                       EmailSendLogRepository emailSendLogRepository) {
        this.userRepository = userRepository;
        this.userLogRepository = userLogRepository;
        this.encoder = encoder;
        this.refreshTokenRepository = refreshTokenRepository;
        this.emailSendLogRepository = emailSendLogRepository;
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
        String jwtToken = JwtUtil.createAccessJwt(user.getUserNo(), secretKey); // 토큰 발급해서 넘김
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


        tokens.put("accessToken", jwtToken);
        tokens.put("refreshToken", refreshToken);

        // 로그인 log 기록
        UserLog userLog = new UserLog();
        userLog.setUser(user);
        userLogRepository.save(userLog);

        return tokens;
    }

    // 유저 이메일 확인(이메일 존재하는지)
    @Transactional
    public User fineByUser(String email) {
        Optional<User> byEmail = userRepository.findByEmail(email);
        if (byEmail.isEmpty()) {
            return null;
        }
        return byEmail.get();
    }

    // 회원 정보 수정
    @Transactional
    public User update(UserUpdateDTO userUpdateDTO, String token) {

        // 토큰 꺼내기(첫 번째가 토큰이다. Bearer 제외)
        String parsingToken = token.split(" ")[1];

        Long userNo = JwtUtil.getUserNo(parsingToken, secretKey);
        Optional<User> user = userRepository.findById(userNo);

        if (user.isPresent()) {
            User findUser = user.get();
            if (userUpdateDTO.getPassword() != null && !userUpdateDTO.getPassword().isEmpty()) {
                findUser.updatePassword(encoder.encode(userUpdateDTO.getPassword()));
            }
            if (userUpdateDTO.getNickname() != null && !userUpdateDTO.getNickname().isEmpty()) {
                findUser.updateNickname(userUpdateDTO.getNickname());
            }
            return findUser;
        } else {
            // 적절한 예외 처리를 해줍니다.
            throw new IllegalArgumentException("유효하지 않은 이메일입니다.");
        }
    }

    // 로그아웃 처리
    public int logout(String token) {

        String parsingToken = token.split(" ")[1];
        Optional<RefreshToken> byRefreshToken = refreshTokenRepository.findByRefreshToken(parsingToken);
        RefreshToken refreshToken = byRefreshToken.get(); // 유저의 리프레시 토큰 꺼냄.
        refreshToken.setRefreshToken("");
        RefreshToken save = refreshTokenRepository.save(refreshToken);

        if (save.getRefreshToken().equals("")) {
            return 1;
        } else {
            return 0;
        }
    }

    // 유저 인증번호 확인
    public boolean tempCodeCheck(TempCodeDTO tempCodeDTO) {
        String email = tempCodeDTO.getEmail();
        String code = tempCodeDTO.getCode();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("No user found with the provided email."));

        Long userNo = user.getUserNo();

        EmailSendLog emailSendLog = emailSendLogRepository.findTopByUserUserNoOrderByCreateTimeDesc(userNo)
                .orElseThrow(() -> new IllegalArgumentException("No verification code sent to the user found."));

        return emailSendLog.getVerificationCode().equals(code);
    }
}
