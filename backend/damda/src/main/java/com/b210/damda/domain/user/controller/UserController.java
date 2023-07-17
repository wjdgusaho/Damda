package com.b210.damda.domain.user.controller;

import com.b210.damda.domain.dto.UserLoginDTO;
import com.b210.damda.domain.dto.UserRegistDTO;
import com.b210.damda.domain.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class UserController {

    public UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // 회원가입 요청
    @PostMapping("regist")
    public ResponseEntity<?> regist(@RequestBody UserRegistDTO userRegistDTO){
        Long savedId = userService.regist(userRegistDTO);
        if(savedId != 0){
            return new ResponseEntity<>(savedId, HttpStatus.OK);
        }else {
            return new ResponseEntity<>("FAIL", HttpStatus.OK);
        }
    }

    @PostMapping("login")
    public ResponseEntity<?> login(@RequestBody UserLoginDTO userLoginDTO){
        String result = userService.login(userLoginDTO);
        if(result.equals("noEmail")){
            return new ResponseEntity<>("No User", HttpStatus.OK);
        }else if(result.equals("ok")){
            return new ResponseEntity<>("Ok", HttpStatus.OK);
        }else{
            return new ResponseEntity<>("fail password", HttpStatus.OK);
        }
    }
}
