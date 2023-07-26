package com.b210.damda.domain.user.controller;

import com.b210.damda.domain.dto.UserLoginDTO;
import com.b210.damda.domain.dto.UserOriginRegistDTO;
import com.b210.damda.domain.dto.UserUpdateDTO;
import com.b210.damda.domain.entity.User;
import com.b210.damda.domain.file.service.FileStoreService;
import com.b210.damda.domain.user.service.UserService;
import com.b210.damda.util.emailAPI.dto.TempCodeDTO;
import com.b210.damda.util.emailAPI.service.EmailService;
import io.jsonwebtoken.io.IOException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/user")
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
        try {
            String fileUri = "";

            if(profileImage.isEmpty() && profileImage.getSize() == 0){
                fileUri = "profile.jpg";
            }else{
                fileUri = fileStoreService.storeFile(profileImage);
            }

            User savedUser = userService.regist(userOriginRegistDTO, fileUri);
            if(savedUser != null){
                return new ResponseEntity<>("회원가입 완료", HttpStatus.CREATED);
            }else {
                return new ResponseEntity<>("회원가입 실패", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch(IOException e){
            return new ResponseEntity<>("사진저장 실패", HttpStatus.INTERNAL_SERVER_ERROR);
        } catch(Exception e){
            return new ResponseEntity<>("서버 에러", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 이메일 중복체크
    @PostMapping("check-email")
    public ResponseEntity<?> emailCheck(@RequestBody UserOriginRegistDTO userOriginRegistDTO){
        String email = userOriginRegistDTO.getEmail();
        try {
            User user = userService.fineByUser(email);
            if(user != null){
                return new ResponseEntity<>("이메일 사용 불가능", HttpStatus.OK);
            }else{
                return new ResponseEntity<>("이메일 사용 가능", HttpStatus.OK);
            }
        }catch (Exception e){
            return new ResponseEntity<>("서버 에러", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 로그인 요청
    @PostMapping("login")
    public ResponseEntity<?> login(@RequestBody UserLoginDTO userLoginDTO){
        Map<String, String> loginUser = userService.login(userLoginDTO.getEmail(), userLoginDTO.getPassword());

        if(loginUser.get("error") != null && loginUser.get("error").equals("no email")){ //
            return new ResponseEntity<>("아이디 없음", HttpStatus.OK);
        }else if (loginUser.get("error") != null && loginUser.get("error").equals("no password")){
            return new ResponseEntity<>("비밀번호 틀림", HttpStatus.OK);
        }else{
            return new ResponseEntity<>(loginUser, HttpStatus.OK);
        }
    }

    // 비밀번호 이메일 인증 요청
    @PostMapping("change-password/email")
    public ResponseEntity<?> emailConfirm(@RequestBody TempCodeDTO emailRequest) throws Exception {
        String email = emailRequest.getEmail();
        try{
            User user = userService.fineByUser(email);
            if(user.getAccountType().equals("KAKAO") || user == null){ // 인증번호 전송은 ORIGIN 유저만 가능.
                return new ResponseEntity<>("이메일 없음",HttpStatus.OK);
            }
            String key = emailService.sendSimpleMessage(email);
            if(emailService.registTempKey(key, email, user) == 0){
                return new ResponseEntity<>("인증번호 전송 실패", HttpStatus.INTERNAL_SERVER_ERROR);
            }
            return new ResponseEntity<>("인증번호 전송 성공", HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>("서버 에러", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    // 인증번호 제출
    @PostMapping("change-password/code")
    public ResponseEntity<?> tempCodeConfirm(@RequestBody TempCodeDTO tempCodeDTO){
        try{
            int result = userService.tempCodeCheck(tempCodeDTO);
            if(result == 1){
                return new ResponseEntity<>("만료시간 지남", HttpStatus.OK);
            }else if(result == 2){
                return new ResponseEntity<>("인증번호 일치", HttpStatus.OK);
            }else if(result == 3){
                return new ResponseEntity<>("이미 사용", HttpStatus.OK);
            }else{
                return new ResponseEntity<>("인증번호 불일치", HttpStatus.OK);
            }
        }catch (Exception e){
            return new ResponseEntity<>("서버 에러", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    // 비밀번호 재설정
    @PatchMapping("change-password/new")
    public ResponseEntity<?> newPassword(@RequestBody UserUpdateDTO userUpdateDTO){
        try{
            int result = userService.newPassword(userUpdateDTO);
            if(result == 3){
                return new ResponseEntity<>("비밀번호 변경 성공", HttpStatus.OK);
            }
            else if(result == 2){
                return new ResponseEntity<>("동일한 비밀번호", HttpStatus.OK);
            }else{
                return new ResponseEntity<>("비밀번호 변경에 실패", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }catch (Exception e){
            return new ResponseEntity<>("서버 에러", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 로그아웃
    @PostMapping("logout")
    public ResponseEntity<?> logout(@RequestHeader(value="Authorization") String token){

        int logout = userService.logout(token);
        if(logout == 1){
            return new ResponseEntity<>("로그아웃 성공", HttpStatus.OK);
        }else{
            return new ResponseEntity<>("서버 에러", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("info")
    public ResponseEntity<?> passwordCheck(@RequestHeader(value="Authorization") String token
            , @RequestBody UserLoginDTO userLoginDTO){
        String password = userLoginDTO.getPassword();
        int result = userService.passwordCheck(token, password);
        if(result == 1){
            return new ResponseEntity<>("해당 유저 없음", HttpStatus.BAD_REQUEST);
        }else if(result == 2){
            return new ResponseEntity<>("비밀번호 일치", HttpStatus.OK);
        }else{
            return new ResponseEntity<>("비밀번호 불일치", HttpStatus.OK);
        }
    }

}
