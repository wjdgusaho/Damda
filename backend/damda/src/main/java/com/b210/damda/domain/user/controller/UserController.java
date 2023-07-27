package com.b210.damda.domain.user.controller;

import com.b210.damda.domain.dto.*;
import com.b210.damda.domain.entity.User;
import com.b210.damda.domain.file.service.FileStoreService;
import com.b210.damda.domain.user.service.UserService;
import com.b210.damda.util.emailAPI.dto.TempCodeDTO;
import com.b210.damda.util.emailAPI.service.EmailService;
import io.jsonwebtoken.io.IOException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
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
            User savedUser = userService.regist(userOriginRegistDTO, profileImage);
            if(savedUser != null){
                return new ResponseEntity<>("회원가입 완료", HttpStatus.CREATED);
            }else {
                return new ResponseEntity<>("회원가입에 실패하셨습니다. 잠시 후 다시 시도해주세요.", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch(IOException e){
            return new ResponseEntity<>("회원가입에 실패하셨습니다. 잠시 후 다시 시도해주세요.", HttpStatus.INTERNAL_SERVER_ERROR);
        } catch(Exception e){
            return new ResponseEntity<>("회원가입에 실패하셨습니다. 잠시 후 다시 시도해주세요.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 이메일 중복체크
    @PostMapping("check-email")
    public ResponseEntity<?> emailCheck(@RequestBody UserOriginRegistDTO userOriginRegistDTO){
        String email = userOriginRegistDTO.getEmail();
        try {
            User user = userService.fineByUser(email);
            if(user != null){
                return new ResponseEntity<>("이메일 사용 불가능", HttpStatus.CONFLICT);
            }else{
                return new ResponseEntity<>("사용 가능", HttpStatus.OK);
            }
        }catch (Exception e){
            return new ResponseEntity<>("재시도", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 로그인 요청
    @PostMapping("login")
    public ResponseEntity<?> login(@RequestBody UserLoginDTO userLoginDTO){
        Map<String, String> loginUser = userService.login(userLoginDTO.getEmail(), userLoginDTO.getUserPw());

        if(loginUser.get("error") != null && loginUser.get("error").equals("유저 없음")){ //
            return new ResponseEntity<>("아이디가 존재하지 않습니다.", HttpStatus.NOT_FOUND);
        }else if(loginUser.get("error") != null && loginUser.get("error").equals("비밀번호 틀림")){
            return new ResponseEntity<>("비밀번호가 올바르지 않습니다.", HttpStatus.UNAUTHORIZED);
        }else if(loginUser.get("error") != null && loginUser.get("error").equals("탈퇴된 유저"))
            return new ResponseEntity<>("탈퇴한 회원입니다.", HttpStatus.GONE);
        else {
            loginUser.put("accountType", "ORIGIN");
            loginUser.put("message", "로그인 성공");
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
                return new ResponseEntity<>("이메일이 존재하지 않습니다.",HttpStatus.NOT_FOUND);
            }
            String key = emailService.sendSimpleMessage(email);
            if(emailService.registTempKey(key, email, user) == 0){
                return new ResponseEntity<>("인증번호 전송에 실패했습니다. 잠시 후 다시 시도해주세요.", HttpStatus.BAD_GATEWAY);
            }
            return new ResponseEntity<>("인증번호 전송 성공", HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>("알 수 없는 에러가 발생하였습니다. 잠시 후 다시 시도해주세요.", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    // 인증번호 제출
    @PostMapping("change-password/code")
    public ResponseEntity<?> tempCodeConfirm(@RequestBody TempCodeDTO tempCodeDTO){
        try{
            int result = userService.tempCodeCheck(tempCodeDTO);
            if(result == 1){
                return new ResponseEntity<>("인증번호가 만료되었습니다.", HttpStatus.REQUEST_TIMEOUT);
            }else if(result == 2){
                return new ResponseEntity<>("인증번호 일치", HttpStatus.OK);
            }else if(result == 3){
                return new ResponseEntity<>("이미 사용한 인증번호입니다.", HttpStatus.CONFLICT);
            }else{
                return new ResponseEntity<>("인증번호가 일치하지 않습니다.", HttpStatus.UNAUTHORIZED);
            }
        }catch (Exception e){
            return new ResponseEntity<>("알 수 없는 에러가 발생하였습니다. 잠시 후 다시 시도해주세요.", HttpStatus.INTERNAL_SERVER_ERROR);
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
                return new ResponseEntity<>("이전과 동일한 비밀번호입니다.", HttpStatus.CONFLICT);
            }else{
                return new ResponseEntity<>("비밀번호 변경에 실패하였습니다. 잠시 후 다시 시도해주세요.", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }catch (Exception e){
            return new ResponseEntity<>("알 수 없는 에러가 발생했습니다. 잠시 후 다시 시도해주세요.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 로그아웃
    @PostMapping("logout")
    public ResponseEntity<?> logout(@RequestHeader(value="Authorization") String token){

        int logout = userService.logout(token);
        if(logout == 1){
            return new ResponseEntity<>("로그아웃 성공", HttpStatus.OK);
        }else{
            return new ResponseEntity<>("알 수 없는 에러가 발생했습니다. 잠시 후 다시 시도해주세요.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 비밀번호 2차 검증
    @PostMapping("info")
    public ResponseEntity<?> passwordCheck(@RequestBody UserLoginDTO userLoginDTO){
        int result = userService.passwordCheck(userLoginDTO.getUserPw());
        if(result == 1){
            return new ResponseEntity<>("알 수 없는 에러가 발생했습니다. 잠시 후 다시 시도해주세요.", HttpStatus.INTERNAL_SERVER_ERROR);
        }else if(result == 2){
            return new ResponseEntity<>("비밀번호 일치", HttpStatus.OK);
        }else{
            return new ResponseEntity<>("비밀번호가 일치하지 않습니다.", HttpStatus.UNAUTHORIZED);
        }
    }

    // 유저 검색
    @GetMapping("search")
    public ResponseEntity<?> userSearch(@RequestBody UserSearchDTO userSearchDTO){
        List<UserSearchResultDTO> userSearchResultDTOS = userService.userSearch(userSearchDTO.getQuery(), userSearchDTO.getType());
        return new ResponseEntity<>(userSearchResultDTOS, HttpStatus.OK);
    }

    // 유저 회원정보 수정
    @PatchMapping("info")
    public ResponseEntity<?> userInfoUpdate(@RequestPart("user") UserUpdateDTO userUpdateDTO,
                                            @RequestPart("profileImage") MultipartFile profileImage){
        int result = userService.userInfoUpdate(userUpdateDTO, profileImage);
        if(result == 1){
            return new ResponseEntity<>("알 수 없는 에러가 발생했습니다. 잠시 후 다시 시도해주세요.",HttpStatus.INTERNAL_SERVER_ERROR);
        }else if(result == 2){
            return new ResponseEntity<>("수정이 완료되었습니다.",HttpStatus.OK);
        }else{
            return new ResponseEntity<>("알 수 없는 에러가 발생했습니다. 잠시 후 다시 시도해주세요.",HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 회원 탈퇴
    @PatchMapping("delete")
    public ResponseEntity<?> userWithdrawal(){
        try{
            userService.userWithdrawal();
            return new ResponseEntity<>("회원 탈퇴에 성공하였습니다.", HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>("알 수 없는 에러가 발생했습니다. 잠시 후 다시 시도해주세요.", HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

}
