package com.b210.damda.domain.friend.service;

import com.b210.damda.domain.dto.Friend.FriendListDTO;
import com.b210.damda.domain.entity.User.User;
import com.b210.damda.domain.entity.User.UserFriend;
import com.b210.damda.domain.friend.repository.FriendRepository;
import com.b210.damda.domain.user.repository.UserRepository;
import jdk.swing.interop.SwingInterOpUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

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

    // 친구 추가
    public void friendRequest(Long FriendNo){
        System.out.println(123);
        Long userNo = getUserNo(); // 현재 유저의 키 값
        Optional<User> byId = userRepository.findById(userNo);// 현재 유저를 꺼냄
        User currentUser = byId.get();

        Optional<User> byId1 = userRepository.findById(FriendNo); // 친구 유저를 꺼냄
        User friendUser = byId1.get();

        System.out.println(currentUser);
        System.out.println(friendUser);

        List<UserFriend> currentUserList = friendRepository.getUserFriendByUser(currentUser); // 현재 유저의 친구 목록 꺼냄
        List<UserFriend> friendUserList = friendRepository.getUserFriendByUser(friendUser); // 친구의 친구 목록을 꺼냄

        System.out.println(currentUserList);
        System.out.println(friendUserList);

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
                uf.updateRequest(friendUser, currentUser); // 친구 컬럼 업데이트
                friendRepository.save(uf); // 저장
                friendExist = true;
                break;
            }
        }

        if (!friendExist) { // 친구 유저의 친구 목록에 현재 유저가 없으면 새 항목을 생성
            UserFriend newFriend = new UserFriend(null, friendUser, currentUser, false, "REQUESTED", LocalDateTime.now(), null);
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
}
