package com.b210.damda.util.kakaoAPI.controller;

import com.b210.damda.domain.entity.RefreshToken;
import com.b210.damda.domain.entity.User.User;
import com.b210.damda.domain.user.repository.UserLogRepository;
import com.b210.damda.domain.user.repository.UserRepository;
import com.b210.damda.util.JwtUtil;
import com.b210.damda.util.refreshtoken.repository.RefreshTokenRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@CrossOrigin("*")
@RestController
//@RequiredArgsConstructor
@RequestMapping("/api/kakao")
@Slf4j
public class KakaoAPIController {


    @Value("${jwt.secret}")
    private String secretKey;

    private final UserRepository userRepository;
    private final UserLogRepository userLogRepository;
    private final RefreshTokenRepository refreshTokenRepository;

    @Autowired
    public KakaoAPIController(UserRepository userRepository, UserLogRepository userLogRepository, RefreshTokenRepository refreshTokenRepository) {
        this.userRepository = userRepository;
        this.userLogRepository = userLogRepository;
        this.refreshTokenRepository = refreshTokenRepository;
    }

    @PostMapping("login")
    public ResponseEntity<?> kakaoLogin(@RequestBody Map<String, Object> data) throws IOException {

        //log.info("code 값을 받았는가? 여기가 실행이되었는가 ? " + data );
        String code = (String) data.get("code");
        Optional<User> optionalUser = userRepository.findByUserPw(code);
        User UserInfo = optionalUser.get();

        // 로그인 성공
        String jwtToken = JwtUtil.createAccessJwt(UserInfo.getUserNo(), secretKey); // 토큰 발급해서 넘김
        String refreshToken = JwtUtil.createRefreshToken(secretKey); // 리프레시 토큰 발급해서 넘김

        Map<String, String> tokens = new HashMap<>();

        tokens.put("accessToken", jwtToken);
        tokens.put("refreshToken", refreshToken);
        tokens.put("accountType", UserInfo.getAccountType());


        Optional<RefreshToken> byUserUserNo = refreshTokenRepository.findByUserUserNo(UserInfo.getUserNo());

        if(byUserUserNo.isPresent()){
            RefreshToken currentRefreshToken = byUserUserNo.get(); // 현재 유저의 리프레시 토큰 꺼내옴

            currentRefreshToken.setRefreshToken(refreshToken); // 전부 새롭게 저장
            currentRefreshToken.setExpirationDate(LocalDateTime.now().plusDays(14));
            currentRefreshToken.setCreateDate(LocalDateTime.now());

            refreshTokenRepository.save(currentRefreshToken); // db에 저장

        } else {
            RefreshToken refreshTokenUser = RefreshToken.builder() // 리프레시 토큰 빌더로 생성
                    .user(UserInfo)
                    .refreshToken(refreshToken)
                    .expirationDate(LocalDateTime.now().plusDays(14))
                    .build();

            refreshTokenRepository.save(refreshTokenUser); // 리프레시 토큰 저장.
        }


        return new ResponseEntity<>(tokens, HttpStatus.OK);
    }
}
