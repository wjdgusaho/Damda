package com.b210.damda.domain.friend.service;

import com.b210.damda.domain.dto.Friend.FriendListDTO;
import com.b210.damda.domain.dto.Friend.FriendRequestListDTO;
import com.b210.damda.domain.entity.User.User;
import com.b210.damda.domain.entity.User.UserFriend;
import com.b210.damda.domain.friend.repository.FriendRepository;
import com.b210.damda.domain.user.repository.UserRepository;
import com.b210.damda.util.exception.CommonException;
import com.b210.damda.util.exception.CustomExceptionStatus;
import jdk.swing.interop.SwingInterOpUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class FriendService {
    private FriendRepository friendRepository;
    private UserRepository userRepository;

    @Autowired
    public FriendService(FriendRepository friendRepository, UserRepository userRepository) {
        this.friendRepository = friendRepository;
        this.userRepository = userRepository;
    }

    public Long getUserNo(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        Long userNo = (Long) principal;

        return userNo;
    }

    @Transactional
    // 친구 추가
    public void friendRequest(Long FriendNo){
        Long userNo = getUserNo(); // 현재 유저의 키 값
        Optional<User> byId = userRepository.findById(userNo);// 현재 유저를 꺼냄
        User currentUser = byId.get();

        Optional<User> byId1 = userRepository.findById(FriendNo); // 친구 유저를 꺼냄
        User friendUser = byId1.get();

        List<UserFriend> currentUserList = friendRepository.getUserFriendByUser(currentUser); // 현재 유저의 친구 목록 꺼냄
        List<UserFriend> friendUserList = friendRepository.getUserFriendByUser(friendUser); // 친구의 친구 목록을 꺼냄

        boolean friendExist = false; // 친구목록에 존재하는지 판단
        if(currentUserList.size() != 0){ // 친구목록이 있으면
            for(UserFriend uf : currentUserList){
                if(uf.getFriend().getUserNo() == FriendNo){
                    uf.updateRequest(currentUser, friendUser); // 친구 컬럽 업데이트
                    friendRepository.save(uf); // 저장
                    friendExist = true;
                    break;
                }
            }
        }

        if(!friendExist){
            UserFriend userFriend = new UserFriend(null, currentUser, friendUser, false, "REQUESTED", LocalDateTime.now(), null);
            friendRepository.save(userFriend);
        }

        friendExist = false;
        for(UserFriend uf : friendUserList){
            if(uf.getFriend().getUserNo() == userNo){
                uf.updateReceive(friendUser, currentUser); // 친구 컬럼 업데이트
                friendRepository.save(uf); // 저장
                friendExist = true;
                break;
            }
        }

        if (!friendExist) { // 친구 유저의 친구 목록에 현재 유저가 없으면 새 항목을 생성
            UserFriend newFriend = new UserFriend(null, friendUser, currentUser, false, "RECEIVED", LocalDateTime.now(), null);
            friendRepository.save(newFriend);
        }
    }

    // 내 친구 목록 조회
    public List<FriendListDTO> friendList(){

        List<FriendListDTO> friendListDTO = new ArrayList<>();

        Long userNo = getUserNo(); // 현재 유저를 찾음
        User currentUser = userRepository.findById(userNo).get();

        List<UserFriend> userFriendByUser = friendRepository.getUserFriendByUser(currentUser);

        if(userFriendByUser.size() > 0){
            for(UserFriend uf : userFriendByUser){ // 유저의 친구 목록을 하나씩 꺼내서
                if(uf.getStatus().equals("ACCEPTED")){ // 만약에 수락받은 상태면
                    friendListDTO.add(new FriendListDTO(uf, uf.getFriend()));
                }
            }
        }

        return friendListDTO;
    }

    @Transactional
    // 즐겨찾기 추가
    public void friendRequestFavoriteAdd(Long friendNo){
        Long userNo = getUserNo(); // 현재 유저 꺼냄
        User currentUser = userRepository.findById(userNo).get();

        User friendUser = userRepository.findById(friendNo).get(); // 친구 유저 꺼냄

        // 만약에 탈퇴했다면
        if(friendUser.getDeleteDate() != null){
            throw new CommonException(CustomExceptionStatus.USER_ALREADY_DEACTIVATED);
        }

        UserFriend findFriend = friendRepository.getUserFriendByUserAndFriend(currentUser, friendUser); // 나와 친구인 UserFriend를 하나 찾음.

        findFriend.updateFavoriteAdd(); // 즐겨찾기 추가
    }

    @Transactional
    // 즐겨찾기 삭제
    public void friendRequestFavoriteDel(Long friendNo){
        Long userNo = getUserNo(); // 현재 유저 꺼냄
        User currentUser = userRepository.findById(userNo).get();

        User friendUser = userRepository.findById(friendNo).get(); // 친구 유저 꺼냄

        UserFriend findFriend = friendRepository.getUserFriendByUserAndFriend(currentUser, friendUser); // 나와 친구인 UserFriend를 하나 찾음.

        findFriend.updateFavoriteDel(); // 즐겨찾기 추가
    }

    // 받은 친구요청 조회
    public List<FriendRequestListDTO> friendRequestList(){
        List<FriendRequestListDTO> FriendRequestListDTO = new ArrayList<>();

        Long userNo = getUserNo(); // 현재 유저 꺼냄
        User currentUser = userRepository.findById(userNo).get();
        String str = "RECEIVED";

        List<UserFriend> userFriendByFriend = friendRepository.findUserFriendByUserFriend(currentUser, str); // 현재 유저와 요청중인 상태를 보내서 요청받은 리스트 꺼냄
        System.out.println(userFriendByFriend);

        for(UserFriend uf : userFriendByFriend){ // 하나씩 꺼내서 친구의 정보를 dto로 생성해서 리스트에 추가.
            if(uf.getFriend().getDeleteDate() == null){
                FriendRequestListDTO.add(new FriendRequestListDTO(uf.getFriend()));
            }
        }

        return FriendRequestListDTO;
    }

    // 친구 수락
    @Transactional
    public void friendReqeustAccept(Long friendNo){

        Long userNo = getUserNo();
        User currentUser = userRepository.findById(userNo).get(); // 현재 유저를 찾음.

        User friendUser = userRepository.findById(friendNo).get(); // 친구 유저를 찾음,


        // 현재 유저와 친구의 데이터를 꺼냄
        UserFriend currentUserFriendship = friendRepository.getUserFriendByUserAndFriend(currentUser, friendUser);
        // 요청 데이터가 없는 경우, 내가 요청받은 상태가 아닌 경우
        if(currentUserFriendship == null || !currentUserFriendship.getStatus().equals("RECEIVED")){
            throw new CommonException(CustomExceptionStatus.NOT_REQUESTED_FRIEND);
        }

        // 친구 유저와 현재 유저의 데이터를 꺼냄
        UserFriend friendUserFriendship = friendRepository.getUserFriendByUserAndFriend(friendUser, currentUser);
        // 요청 데이터가 없는 경우, 친구가 요청한 상태가 아닌 경우
        if(friendUserFriendship == null || !friendUserFriendship.getStatus().equals("REQUESTED")){
            throw new CommonException(CustomExceptionStatus.NOT_REQUESTED_FRIEND);
        }

        currentUserFriendship.acceptFriendRequest(); // 둘 다 "ACCEPTED"로 바꾸고 응답시간 추가
        friendUserFriendship.acceptFriendRequest();

        friendRepository.save(currentUserFriendship); // 수동 저장
        friendRepository.save(friendUserFriendship);

    }

    // 친구 거절
    @Transactional
    public void friendReqeustReject(Long friendNo){

        Long userNo = getUserNo();
        User currentUser = userRepository.findById(userNo).get(); // 현재 유저를 찾음.

        User friendUser = userRepository.findById(friendNo).get(); // 친구 유저를 찾음,

        // 현재 유저와 친구의 데이터를 꺼냄
        UserFriend currentUserFriendship = friendRepository.getUserFriendByUserAndFriend(currentUser, friendUser);
        // 요청 데이터가 없는 경우, 내가 요청받은 상태가 아닌 경우
        if(currentUserFriendship == null || !currentUserFriendship.getStatus().equals("RECEIVED")){
            throw new CommonException(CustomExceptionStatus.NOT_REQUESTED_FRIEND);
        }

        // 친구 유저와 현재 유저의 데이터를 꺼냄
        UserFriend friendUserFriendship = friendRepository.getUserFriendByUserAndFriend(friendUser, currentUser);
        // 요청 데이터가 없는 경우, 친구가 요청한 상태가 아닌 경우
        if(friendUserFriendship == null || !friendUserFriendship.getStatus().equals("REQUESTED")){
            throw new CommonException(CustomExceptionStatus.NOT_REQUESTED_FRIEND);
        }

        currentUserFriendship.rejectFriendRequest(); // 둘 다 "REJECTED"로 바꾸고 응답시간 추가
        friendUserFriendship.rejectFriendRequest();

        friendRepository.save(currentUserFriendship); // 수동 저장
        friendRepository.save(friendUserFriendship);
    }

    // 친구 삭제
    @Transactional
    public void friendDelete(Long friendNo){
        Long userNo = getUserNo();
        User currentUser = userRepository.findById(userNo).get(); // 현재 유저를 찾음.

        User friendUser = userRepository.findById(friendNo).get(); // 친구 유저를 찾음,

        // 현재 유저와 친구의 데이터를 꺼냄
        UserFriend currentUserFriendship = friendRepository.getUserFriendByUserAndFriend(currentUser, friendUser);
        // 요청 데이터가 없는 경우, 내가 요청받은 상태가 아닌 경우
        if(currentUserFriendship == null || !currentUserFriendship.getStatus().equals("ACCEPTED")){
            throw new CommonException(CustomExceptionStatus.NOT_REQUESTED_FRIEND);
        }

        // 친구 유저와 현재 유저의 데이터를 꺼냄
        UserFriend friendUserFriendship = friendRepository.getUserFriendByUserAndFriend(friendUser, currentUser);
        // 요청 데이터가 없는 경우, 친구가 요청한 상태가 아닌 경우
        if(friendUserFriendship == null || !friendUserFriendship.getStatus().equals("ACCEPTED")){
            throw new CommonException(CustomExceptionStatus.NOT_REQUESTED_FRIEND);
        }

        currentUserFriendship.FriendDelete(); // 둘 다 ""로 바꾸고 응답시간 null로 바꿈
        friendUserFriendship.FriendDelete();

        friendRepository.save(currentUserFriendship); // 수동 저장
        friendRepository.save(friendUserFriendship);

    }
}
