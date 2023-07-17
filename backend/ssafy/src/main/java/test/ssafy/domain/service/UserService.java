package test.ssafy.domain.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import test.ssafy.domain.dto.UserRegistDTO;
import test.ssafy.domain.entity.User;
import test.ssafy.domain.repository.UserRepository;

@Service
public class UserService {

    public UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

        public Long regist(UserRegistDTO userRegistDTO){
        User savedUser = userRepository.save(userRegistDTO.toEntity());
        return savedUser.getId();
    }
}
