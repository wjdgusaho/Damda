package com.b210.damda.domain.user.controller;

import com.b210.damda.domain.dto.UserLoginDTO;
import com.b210.damda.domain.dto.UserRegistDTO;
import com.b210.damda.domain.dto.UserUpdateDTO;
import com.b210.damda.domain.user.service.UserService;
import com.b210.damda.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

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
        Map<String, String> loginUser = userService.login(userLoginDTO.getEmail(), userLoginDTO.getPassword());

        if(loginUser.get("error") != null && loginUser.get("error").equals("no email")){ //
            return new ResponseEntity<>("no user", HttpStatus.OK);
        }else if (loginUser.get("error") != null && loginUser.get("error").equals("no password")){
            return new ResponseEntity<>("fail password", HttpStatus.OK);
        }else{
            return new ResponseEntity<>(loginUser, HttpStatus.OK);
        }
    }

    @PatchMapping("update")
    public ResponseEntity<?> update(@RequestHeader(value="Authorization") String token, @RequestBody UserUpdateDTO userUpdateDTO){
        userService.update(userUpdateDTO, token);
        return new ResponseEntity<>(token, HttpStatus.OK);
    }
}
