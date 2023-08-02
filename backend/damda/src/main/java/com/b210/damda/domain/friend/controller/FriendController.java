package com.b210.damda.domain.friend.controller;

import com.b210.damda.domain.dto.User.UserDTO;
import com.b210.damda.domain.friend.FriendService;
import com.b210.damda.util.response.DataResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/friend")
public class FriendController {

    private FriendService friendService;

    @Autowired
    public FriendController(FriendService friendService) {
        this.friendService = friendService;
    }

    @PatchMapping("request")
    public DataResponse<Map<String, Object>> friendRequest(@RequestBody UserDTO userDTO){
        try{
            Long userNo = userDTO.getUserNo();

            friendService.friendRequest(userDTO.getUserNo());
            return new DataResponse<>(200, "친구 신청이 완료되었습니다.");
        }catch (Exception e){
            return new DataResponse<>(500, "알 수 없는 에러가 발생했습니다. 잠시 후 다시 시도해주세요.");
        }

    }


}
