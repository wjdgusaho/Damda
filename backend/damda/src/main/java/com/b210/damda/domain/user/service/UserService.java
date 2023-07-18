package com.b210.damda.domain.user.service;

import com.b210.damda.domain.dto.UserLoginDTO;
import com.b210.damda.domain.dto.UserRegistDTO;
import com.b210.damda.domain.entity.User;
import com.b210.damda.domain.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.Optional;

@Service
public class UserService {

    public UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public Long regist(UserRegistDTO userRegistDTO){
        User savedUser = userRepository.save(userRegistDTO.toEntity());
        return savedUser.getId();
    }

    @Transactional
    public String login(UserLoginDTO userLoginDTO){
        Optional<User> findUser = userRepository.findByEmail(userLoginDTO.getEmail());

        // 유저의 이메일이 없음
        if(findUser.isEmpty()){
            return "noEmail";
        }

        // 로그인 성공
        if(findUser.get().getPassword().equals(userLoginDTO.getPassword())){
            return "ok";
        }else{ // 비밀번호 틀림
            return "no";
        }

    }


}
