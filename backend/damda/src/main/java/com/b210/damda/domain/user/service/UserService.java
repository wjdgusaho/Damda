package com.b210.damda.domain.user.service;

import com.b210.damda.domain.dto.UserOriginRegistDTO;
import com.b210.damda.domain.dto.UserUpdateDTO;
import com.b210.damda.domain.entity.User;
import com.b210.damda.domain.entity.UserLog;
import com.b210.damda.domain.user.repository.UserLogRepository;
import com.b210.damda.domain.user.repository.UserRepository;
import com.b210.damda.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class UserService {

    @Value("${jwt.secret}")
    private String secretKey;
    private UserRepository userRepository;
    private UserLogRepository userLogRepository;
    private final BCryptPasswordEncoder encoder;

    @Autowired
    public UserService(UserRepository userRepository, UserLogRepository userLogRepository, BCryptPasswordEncoder encoder) {
        this.userRepository = userRepository;
        this.userLogRepository = userLogRepository;
        this.encoder = encoder;
    }


    // 회원가입
    @Transactional
    public User regist(UserOriginRegistDTO userOriginRegistDTO){
        String encode = encoder.encode(userOriginRegistDTO.getUserPw()); // 비밀번호 암호화
        if(userOriginRegistDTO.getProfileImage().equals("")){
            userOriginRegistDTO.setProfileImage("default");
        }
        userOriginRegistDTO.setUserPw(encode);
        User savedUser = userRepository.save(userOriginRegistDTO.toEntity());
        return savedUser;
    }

    // 로그인
    @Transactional
    public Map<String, String> login(String email, String password){
        Optional<User> findUser = userRepository.findByEmail(email);
        Map<String, String> tokens = new HashMap<>();

        // 유저의 이메일이 없음
        if(findUser.isEmpty()){
            tokens.put("error", "no email");
            return tokens;
        }

        if(!encoder.matches(password, findUser.get().getUserPw())){
            tokens.put("error", "no password");
            return tokens;
        }
        User user = findUser.get();

        // 로그인 성공
        String jwtToken = JwtUtil.createAccessJwt(user.getUserNo(), secretKey); // 토큰 발급해서 넘김
        String refreshToken = JwtUtil.createRefreshToken(secretKey); // 리프레시 토큰 발급해서 넘김

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
    public User fineByUser(String email){
        Optional<User> byEmail = userRepository.findByEmail(email);
        User user = byEmail.get();
        return user;
    }

    // 회원 정보 수정
    @Transactional
    public User update(UserUpdateDTO userUpdateDTO, String token){

        // 토큰 꺼내기(첫 번째가 토큰이다. Bearer 제외)
        String parsingToken = token.split(" ")[1];

        Long userId = JwtUtil.getUserNo(parsingToken, secretKey);
        Optional<User> user = userRepository.findById(userId);

        if(user.isPresent()) {
            User findUser = user.get();
            if(userUpdateDTO.getPassword() != null && !userUpdateDTO.getPassword().isEmpty()) {
                findUser.updatePassword(encoder.encode(userUpdateDTO.getPassword()));
            }
            if(userUpdateDTO.getNickname() != null && !userUpdateDTO.getNickname().isEmpty()) {
                findUser.updateNickname(userUpdateDTO.getNickname());
            }
            return findUser;
        } else {
            // 적절한 예외 처리를 해줍니다.
            throw new IllegalArgumentException("유효하지 않은 이메일입니다.");
        }
    }


}
