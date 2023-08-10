package com.b210.damda.domain.friend.controller;

import com.b210.damda.domain.dto.Friend.FriendListDTO;
import com.b210.damda.domain.dto.Friend.FriendNoRequestDTO;
import com.b210.damda.domain.dto.Friend.FriendRequestListDTO;
import com.b210.damda.domain.dto.User.UserDTO;
import com.b210.damda.domain.dto.serverSentEvent.FriendEventEnum;
import com.b210.damda.domain.entity.User.UserFriend;
import com.b210.damda.domain.friend.service.FriendService;
import com.b210.damda.util.exception.CommonException;
import com.b210.damda.util.response.DataResponse;
import com.b210.damda.util.serverSentEvent.service.FriendEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/friend")
public class FriendController {

    private FriendService friendService;
    private FriendEventService friendEventService;

    @Autowired
    public FriendController(FriendService friendService, FriendEventService friendEventService) {
        this.friendService = friendService;
        this.friendEventService = friendEventService;
    }

    // 친구 요청
    @PatchMapping("request")
    public DataResponse<Map<String, Object>> friendRequest(@RequestBody UserDTO userDTO){
        try{
            friendService.friendRequest(userDTO.getUserNo());
//            friendEventService.friendRequestEvent(userDTO.getUserNo());
            friendEventService.friendEventService(userDTO.getUserNo(), FriendEventEnum.REQUEST);
            return new DataResponse<>(200, "친구 신청이 완료되었습니다.");
        }catch (CommonException e){
            return new DataResponse<>(e.getCustomExceptionStatus().getCode(), e.getCustomExceptionStatus().getMessage());
        }catch (Exception e){
            return new DataResponse<>(500, "알 수 없는 에러가 발생했습니다. 잠시 후 다시 시도해주세요.");
        }
    }

    // 친구 목록 조회
    @GetMapping("list")
    public DataResponse<Map<String, Object>> friendList(){
        try{
            List<FriendListDTO> friendListDTO = friendService.friendList();

            Map<String, Object> result = new HashMap<>();
            result.put("result", friendListDTO); // 친구 목록을 맵에 넣음

            DataResponse<Map<String, Object>> response = new DataResponse<>(200, "친구 목록");

            response.setData(result);
            return response;
        }catch (CommonException e){
            return new DataResponse<>(e.getCustomExceptionStatus().getCode(), e.getCustomExceptionStatus().getMessage());
        }catch (Exception e){
            return new DataResponse<>(500, "알 수 없는 에러가 발생했습니다. 잠시 후 다시 시도해주세요.");
        }
    }

    // 즐겨찾기 추가
    @PatchMapping("favorite-add")
    public DataResponse<Map<String, Object>> friendFavoriteAdd(@RequestBody FriendListDTO friendListDTO){
        try{
            friendService.friendRequestFavoriteAdd(friendListDTO.getUserNo());
            return new DataResponse<>(200, "즐겨찾기 추가 성공");
        }catch (CommonException e){
            return new DataResponse<>(e.getCustomExceptionStatus().getCode(), e.getCustomExceptionStatus().getMessage());
        }catch (Exception e){
            return new DataResponse<>(500, "알 수 없는 에러가 발생했습니다. 잠시 후 다시 시도해주세요.");
        }
    }

    // 즐겨찾기 해제
    @PatchMapping("favorite-del")
    public DataResponse<Map<String, Object>> friendFavoriteDel(@RequestBody FriendListDTO friendListDTO){
        try{
            friendService.friendRequestFavoriteDel(friendListDTO.getUserNo());
            return new DataResponse<>(200, "즐겨찾기 삭제 성공");
        }catch (CommonException e){
            return new DataResponse<>(e.getCustomExceptionStatus().getCode(), e.getCustomExceptionStatus().getMessage());
        }catch (Exception e){
            return new DataResponse<>(500, "알 수 없는 에러가 발생했습니다. 잠시 후 다시 시도해주세요.");
        }
    }

    // 친구 요청받은 목록 불러오기
    @GetMapping("request")
    public DataResponse<Map<String, Object>> friendRequestList(){
        try{
            Map<String, Object> result = new HashMap<>();
            List<FriendRequestListDTO> friendRequestListDTOS = friendService.friendRequestList();
            result.put("result" , friendRequestListDTOS);

            DataResponse<Map<String, Object>> response = new DataResponse<>(200, "요청 목록 조회 성공");
            response.setData(result);

            return response;
        }catch (CommonException e){
            return new DataResponse<>(e.getCustomExceptionStatus().getCode(), e.getCustomExceptionStatus().getMessage());
        }catch (Exception e){
            return new DataResponse<>(500, "알 수 없는 에러가 발생했습니다. 잠시 후 다시 시도해주세요.");
        }
    }

    // 친구 수락
    @PatchMapping("request-accept")
    public DataResponse<Map<String, Object>> friendAccept(@RequestBody FriendNoRequestDTO friendNoRequestDTO){
        try{
            friendService.friendReqeustAccept(friendNoRequestDTO.getUserNo());
//            friendEventService.friendAcceptEvent(friendNoRequestDTO.getUserNo());
            friendEventService.friendEventService(friendNoRequestDTO.getUserNo(), FriendEventEnum.ACCEPT);
            return new DataResponse<>(200, "친구 신청 수락");
        }catch (CommonException e){
            return new DataResponse<>(e.getCustomExceptionStatus().getCode(), e.getCustomExceptionStatus().getMessage());
        }catch (Exception e){
            return new DataResponse<>(500 ,"알 수 없는 에러가 발생했습니다. 잠시 후 다시 시도해주세요.");
        }
    }

    // 친구 거절
    @PatchMapping("request-reject")
    public DataResponse<Map<String, Object>> friendReject(@RequestBody FriendNoRequestDTO friendNoRequestDTO){
        try{
            friendService.friendReqeustReject(friendNoRequestDTO.getUserNo());
            //friendEventService.friendDenyEvent(friendNoRequestDTO.getUserNo());
            friendEventService.friendEventService(friendNoRequestDTO.getUserNo(), FriendEventEnum.REJECT);
            return new DataResponse<>(200, "친구 신청 거절");
        }catch (CommonException e){
            return new DataResponse<>(e.getCustomExceptionStatus().getCode(), e.getCustomExceptionStatus().getMessage());
        }catch (Exception e){
            return new DataResponse<>(500 ,"알 수 없는 에러가 발생했습니다. 잠시 후 다시 시도해주세요.");
        }
    }

    // 친구 삭제
    @PatchMapping("delete")
    public DataResponse<Map<String, Object>> friendDelete(@RequestBody FriendNoRequestDTO friendNoRequestDTO){
        try{
            friendService.friendDelete(friendNoRequestDTO.getUserNo());
            return new DataResponse<>(200, "친구 삭제 완료");
        }catch (CommonException e){
            return new DataResponse<>(e.getCustomExceptionStatus().getCode(), e.getCustomExceptionStatus().getMessage());
        }catch (Exception e){
            return new DataResponse<>(500 ,"알 수 없는 에러가 발생했습니다. 잠시 후 다시 시도해주세요.");
        }
    }

}
