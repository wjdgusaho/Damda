package com.b210.damda.domain.user.controller;

import com.b210.damda.domain.dto.User.*;
import com.b210.damda.domain.entity.User.User;
import com.b210.damda.domain.file.service.FileStoreService;
import com.b210.damda.domain.user.service.UserService;
import com.b210.damda.util.emailAPI.dto.TempCodeDTO;
import com.b210.damda.util.emailAPI.service.EmailService;
import com.b210.damda.util.exception.CommonException;
import com.b210.damda.util.exception.CustomExceptionStatus;
import com.b210.damda.util.response.DataResponse;
import com.b210.damda.util.serverSentEvent.service.EventStreamService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/user")
public class UserController {

    public UserService userService;
    public EmailService emailService;
    private final FileStoreService fileStoreService;
    private final EventStreamService eventStreamService;

    @Autowired
    public UserController(UserService userService, EmailService emailService, FileStoreService fileStoreService, EventStreamService eventStreamService) {
        this.userService = userService;
        this.emailService = emailService;
        this.fileStoreService = fileStoreService;
        this.eventStreamService = eventStreamService;
    }

    // 회원가입 요청
    @PostMapping("regist")
    public DataResponse<Map<String, Object>> regist(@RequestPart("user") UserOriginRegistDTO userOriginRegistDTO,
                                    @RequestPart("profileImage") MultipartFile profileImage){
        try {
            User savedUser = userService.regist(userOriginRegistDTO, profileImage);
            DataResponse<Map<String, Object>> response = new DataResponse<>(201, "회원가입 완료");
            return response;
        }catch (CommonException e){
            return new DataResponse<>(e.getCustomExceptionStatus().getCode(), e.getCustomExceptionStatus().getMessage());
        }catch(Exception e){
            return new DataResponse<>(500,"회원가입에 실패하셨습니다. 잠시 후 다시 시도해주세요.");
        }
    }

    // 이메일 인증번호 전송
    @PostMapping("send-email")
    public DataResponse<Map<String, Object>> emailSend(@RequestBody UserOriginRegistDTO userOriginRegistDTO) throws Exception {
        try {
            String email = userOriginRegistDTO.getEmail();
            User user = userService.fineByUser(email);
            if (user != null) {
                return new DataResponse<>(409, "이미 가입된 이메일입니다.");
            } else {
                String key = emailService.sendSimpleMessageRegist(email);

                emailService.registTempKey(key, email);

                return new DataResponse<>(200, "인증번호 전송 성공");
            }
        }catch (CommonException e){
            return new DataResponse<>(e.getCustomExceptionStatus().getCode(), e.getCustomExceptionStatus().getMessage());
        }catch (Exception e){
            return new DataResponse<>(500, "알 수 없는 에러가 발생하였습니다. 잠시 후 다시 시도해주세요.");
        }
    }

    // 회원가입 인증코드 확인
    @PostMapping("check-email")
    public DataResponse<Map<String, Object>> checkRegistCode(@RequestBody TempCodeDTO tempCodeDTO) {
        try{
            int result = userService.registCodeCheck(tempCodeDTO);
            DataResponse<Map<String,Object>> response = new DataResponse<>(200, "인증이 완료되었습니다.");
            return response;
        }catch (CommonException e){
            return new DataResponse<>(e.getCustomExceptionStatus().getCode(), e.getCustomExceptionStatus().getMessage());
        }catch (Exception e){
            return new DataResponse<>(500, "알 수 없는 에러가 발생하였습니다. 잠시 후 다시 시도해주세요.");
        }
    }

    // 로그인 요청
    @PostMapping("login")
    public DataResponse<UserLoginSuccessDTO> login(@RequestBody UserLoginDTO userLoginDTO){
        try {
            UserLoginSuccessDTO login = userService.login(userLoginDTO.getEmail(), userLoginDTO.getUserPw());

            DataResponse<UserLoginSuccessDTO> response = new DataResponse<>(200, "로그인 성공");
            response.setData(login);

            return response;
        }catch (CommonException e){
            return new DataResponse<>(e.getCustomExceptionStatus().getCode(), e.getCustomExceptionStatus().getMessage());
        }catch (Exception e){
            return new DataResponse<>(500, "알 수 없는 에러가 발생하였습니다. 잠시 후 다시 시도해주세요.");
        }
    }

    // 비밀번호 이메일 인증 요청
    @PostMapping("change-password/email")
    public DataResponse<Map<String, Object>> emailConfirm(@RequestBody TempCodeDTO tempCodeDTO) throws Exception {
        try {
            String email = tempCodeDTO.getEmail();
            User user = userService.fineByUser(email);

            // 유저가 회원이 아닌 경우
            if (user == null) {
                throw new CommonException(CustomExceptionStatus.USER_NOT_FOUND);
            }

            // 카카오 회원일경우 비밀번호 찾기 불가능
            if (user.getAccountType().equals("KAKAO")) {
                throw new CommonException(CustomExceptionStatus.KAKAO_USER);
            }

            String key = emailService.sendSimpleMessageChange(email);

            // 인증번호 DB 저장
            Long result = emailService.changeTempKey(key, email, user);

            return new DataResponse<>(200, "인증번호를 성공적으로 전송했습니다.");
        }catch (CommonException e){
            return new DataResponse<>(e.getCustomExceptionStatus().getCode(), e.getCustomExceptionStatus().getMessage());
        }catch (Exception e){
            return new DataResponse<>(500, "알 수 없는 에러가 발생하였습니다. 잠시 후 다시 시도해주세요.");
        }
    }

    // 인증번호 제출
    @PostMapping("change-password/code")
    public DataResponse<Map<String, Object>> tempCodeConfirm(@RequestBody TempCodeDTO tempCodeDTO){
        try{
            userService.tempCodeCheck(tempCodeDTO);
            return new DataResponse<>(200, "인증이 완료됐습니다.");
        }catch (CommonException e){
            return new DataResponse<>(e.getCustomExceptionStatus().getCode(), e.getCustomExceptionStatus().getMessage());
        }catch (Exception e){
            return new DataResponse<>(500, "알 수 없는 에러가 발생하였습니다. 잠시 후 다시 시도해주세요.");
        }

    }

    // 비밀번호 재설정
    @PatchMapping("change-password/new")
    public DataResponse<Map<String, Object>> newPassword(@RequestBody UserUpdateDTO userUpdateDTO){
        try{
            userService.newPassword(userUpdateDTO);
            return new DataResponse<>(200, "비밀번호 변경에 성공했습니다.");
        }catch (CommonException e){
            return new DataResponse<>(e.getCustomExceptionStatus().getCode(), e.getCustomExceptionStatus().getMessage());
        }
        catch (Exception e){
            return new DataResponse<>(500,"알 수 없는 에러가 발생했습니다. 잠시 후 다시 시도해주세요.");
        }
    }

    // 로그아웃
    @PostMapping("logout")
    public DataResponse<Map<String, Object>> logout(@RequestHeader(value="Authorization") String token){
        try{
            log.warn("로그아웃 진입!!!!!!");
            eventStreamService.disconnectStream();
            log.warn("로그아웃 진입!!!!!!, 동작 끝!!");
            userService.logout(token);
            return new DataResponse<>(200, "로그아웃 성공");
        }catch (CommonException e){
            return new DataResponse<>(e.getCustomExceptionStatus().getCode(), e.getCustomExceptionStatus().getMessage());
        }catch (Exception e){
            return new DataResponse<>(500,"알 수 없는 에러가 발생했습니다. 잠시 후 다시 시도해주세요.");
        }

    }

    // 비밀번호 2차 검증
    @PostMapping("info")
    public DataResponse<Map<String, Object>> passwordCheck(@RequestBody UserLoginDTO userLoginDTO){
        try {
            User user = userService.passwordCheck(userLoginDTO.getUserPw());

            return new DataResponse<>(200, "비밀번호가 일치합니다.");
        }catch (CommonException e){
            return new DataResponse<>(e.getCustomExceptionStatus().getCode(), e.getCustomExceptionStatus().getMessage());
        }catch (Exception e){
            return new DataResponse<>(500,"알 수 없는 에러가 발생했습니다. 잠시 후 다시 시도해주세요.");
        }
    }

    // 유저 검색
    @GetMapping("search")
    public DataResponse<Map<String, Object>> userSearch(@RequestParam("query") String query, @RequestParam("type") String type){
        try{
            List<UserSearchResultDTO> userSearchResultDTO = userService.userSearch(query, type);

            Map<String, Object> result = new HashMap<>();
            result.put("result" , userSearchResultDTO);

            DataResponse<Map<String, Object>> response = new DataResponse<>(200, "유저 검색 결과");
            response.setData(result);

            return response;
        }catch (CommonException e){
            return new DataResponse<>(e.getCustomExceptionStatus().getCode(), e.getCustomExceptionStatus().getMessage());
        }catch (Exception e){
            return new DataResponse<>(500,"알 수 없는 에러가 발생했습니다. 잠시 후 다시 시도해주세요.");
        }
    }

    // 유저 회원정보 수정
    @PatchMapping("info")
    public DataResponse<Map<String, Object>> userInfoUpdate(@RequestPart("user") UserUpdateDTO userUpdateDTO,
                                            @RequestPart("profileImage") MultipartFile profileImage){
        try {
            User user = userService.userInfoUpdate(userUpdateDTO, profileImage);

            Map<String, Object> result = new HashMap<>();
            result.put("nickname", user.getNickname());
            result.put("profileImage", user.getProfileImage());

            DataResponse<Map<String, Object>> response = new DataResponse<>(200, "회원정보 변경에 성공하였습니다.");
            response.setData(result);
            return response;

        }catch (CommonException e){
            return new DataResponse<>(e.getCustomExceptionStatus().getCode(), e.getCustomExceptionStatus().getMessage());
        }catch (Exception e){
            return new DataResponse<>(500,"알 수 없는 에러가 발생했습니다. 잠시 후 다시 시도해주세요.");
        }
    }

    // 회원 탈퇴
    @PatchMapping("delete")
    public DataResponse<Map<String, Object>> userWithdrawal(){
        try{
            userService.userWithdrawal();
            return new DataResponse<>(200, "정상적으로 탈퇴되었습니다. 그동안 이용해주셔서 감사합니다.");
        }catch (CommonException e){
            return new DataResponse<>(e.getCustomExceptionStatus().getCode(), e.getCustomExceptionStatus().getMessage());
        }
        catch (Exception e){
            return new DataResponse<>(500,"알 수 없는 에러가 발생했습니다. 잠시 후 다시 시도해주세요.");
        }

    }

}
