package com.b210.damda.domain.user.service;

import com.b210.damda.domain.dto.UserLoginDTO;
import com.b210.damda.domain.dto.UserRegistDTO;
import com.b210.damda.domain.dto.UserUpdateDTO;
import com.b210.damda.domain.entity.User;
import com.b210.damda.domain.user.repository.UserRepository;
import com.b210.damda.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.Optional;

@Service
public class UserService {

    @Value("${jwt.secret}")
    private String secretKey;
    public UserRepository userRepository;
    private Long expiredMs = 1000 * 60 * 60L; // 토큰의 만료 시간
    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // 회원가입
    @Transactional
    public Long regist(UserRegistDTO userRegistDTO){
        User savedUser = userRepository.save(userRegistDTO.toEntity());
        return savedUser.getId();
    }

    // 로그인
    @Transactional
    public String login(String email, String password){
        Optional<User> findUser = userRepository.findByEmail(email);

        // 유저의 이메일이 없음
        if(findUser.isEmpty()){
            return "no email";
        }
        // 로그인 성공
        if(findUser.get().getPassword().equals(password)){
            return JwtUtil.createJwt(email, secretKey, expiredMs); // 토큰 발급해서 넘김
        }else{ // 비밀번호 틀림
            return "no password";
        }
    }

    // 회원 정보 수정
    @Transactional
    public Long update(UserUpdateDTO userUpdateDTO, String token){

        // 토큰 꺼내기(첫 번째가 토큰이다. bearer 제외)
        String parsingToken = token.split(" ")[1];

        String userEmail = JwtUtil.getUserEmail(parsingToken, secretKey);
        Optional<User> user = userRepository.findByEmail(userEmail);
        System.out.println(user.get());

        if(user.isPresent()) {
            User findUser = user.get();
            if(userUpdateDTO.getPassword() != null && !userUpdateDTO.getPassword().isEmpty()) {
                findUser.updatePassword(userUpdateDTO.getPassword());
            }
            if(userUpdateDTO.getNickname() != null && !userUpdateDTO.getNickname().isEmpty()) {
                findUser.updateNickname(userUpdateDTO.getNickname());
            }
            return findUser.getId();
        } else {
            // 적절한 예외 처리를 해줍니다.
            throw new IllegalArgumentException("유효하지 않은 이메일입니다.");
        }
    }


}
