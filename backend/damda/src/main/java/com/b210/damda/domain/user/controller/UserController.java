package com.b210.damda.domain.user.controller;

import com.b210.damda.domain.dto.UserLoginDTO;
import com.b210.damda.domain.dto.UserOriginRegistDTO;
import com.b210.damda.domain.dto.UserUpdateDTO;
import com.b210.damda.domain.entity.User;
import com.b210.damda.domain.file.service.FileStoreService;
import com.b210.damda.domain.user.service.UserService;
import com.b210.damda.util.emailAPI.dto.EmailDTO;
import com.b210.damda.util.emailAPI.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    public UserService userService;
    public EmailService emailService;
    private final FileStoreService fileStoreService;

    @Autowired
    public UserController(UserService userService, EmailService emailService, FileStoreService fileStoreService) {
        this.userService = userService;
        this.emailService = emailService;
        this.fileStoreService = fileStoreService;
    }

    // 회원가입 요청
    @PostMapping("regist")
    public ResponseEntity<?> regist(@RequestPart("user") UserOriginRegistDTO userOriginRegistDTO,
                                    @RequestPart("profileImage") MultipartFile profileImage){

        String fileUri = "";

        if(profileImage.isEmpty() && profileImage.getSize() == 0){
            fileUri = "profile.jpg";
        }else{
            fileUri = fileStoreService.storeFile(profileImage);
        }

        User savedUser = userService.regist(userOriginRegistDTO, fileUri);
        if(savedUser != null){
            return new ResponseEntity<>(savedUser, HttpStatus.OK);
        }else {
            return new ResponseEntity<>("FAIL", HttpStatus.OK);
        }
    }

    // 이메일 중복체크
    @GetMapping("regist")
    public ResponseEntity<?> emailCheck(@RequestBody UserOriginRegistDTO userOriginRegistDTO){
        String email = userOriginRegistDTO.getEmail();
        User user = userService.fineByUser(email);
        if(user != null){
            return new ResponseEntity<>("사용불가", HttpStatus.OK);
        }else{
            return new ResponseEntity<>("사용가능", HttpStatus.OK);
        }
    }

    // 로그인 요청
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

    // 비밀번호 이메일 인증 요청
    @PostMapping("change-password/email")
    public ResponseEntity emailConfirm(@RequestBody EmailDTO emailRequest) throws Exception {
        String email = emailRequest.getEmail();

        // 이메일 유저를 찾음
        User user = userService.fineByUser(email);
        if(user == null){
            return new ResponseEntity<>("해당 이메일이 존재하지 않습니다.",HttpStatus.BAD_REQUEST);
        }
        String key = emailService.sendSimpleMessage(email);
        if(emailService.registTempKey(key, email, user) == 0){
            return new ResponseEntity<>("인증번호 전송에 실패하였습니다.", HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>("해당 이메일로 인증번호를 전송하였습니다.", HttpStatus.OK);


    }

    // 회원정보 수정 요청(바꿔야함)
    @PatchMapping("update")
    public ResponseEntity<?> update(@RequestHeader(value="Authorization") String token, @RequestBody UserUpdateDTO userUpdateDTO){
        User updateUser = userService.update(userUpdateDTO, token);
        return new ResponseEntity<>(updateUser, HttpStatus.OK);
    }
}
