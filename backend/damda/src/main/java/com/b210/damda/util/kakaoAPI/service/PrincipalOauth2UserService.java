package com.b210.damda.util.kakaoAPI.service;


import com.b210.damda.domain.entity.User.UserLog;

import com.b210.damda.domain.user.repository.UserLogRepository;
import com.b210.damda.domain.user.repository.UserRepository;
import com.b210.damda.domain.user.service.UserService;
import com.b210.damda.util.refreshtoken.repository.RefreshTokenRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import com.b210.damda.domain.entity.User.User;


import java.util.Map;
import java.util.Optional;

@Service
@Slf4j
public class PrincipalOauth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder;
    private final UserService userService;
    private final UserLogRepository userLogRepository;
    private final RefreshTokenRepository refreshTokenRepository;

    @Autowired
    public PrincipalOauth2UserService(UserRepository userRepository, BCryptPasswordEncoder encoder, UserService userService, UserLogRepository userLogRepository, RefreshTokenRepository refreshTokenRepository) {
        this.userRepository = userRepository;
        this.encoder = encoder;
        this.userService = userService;
        this.userLogRepository = userLogRepository;
        this.refreshTokenRepository = refreshTokenRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException{
        OAuth2User oAuth2User = super.loadUser(userRequest);
        log.info("getAttributes : {}", oAuth2User.getAttributes());

        OAuth2UserInfo oAuth2UserInfo = null;

        String provider = userRequest.getClientRegistration().getRegistrationId();

        if(provider.equals("kakao")){
            log.info("카카오 로그인");
            oAuth2UserInfo  = new KakaoUserInfo((Map) oAuth2User.getAttributes());
        }

        String providerId = oAuth2UserInfo.getProviderId();
        String email = oAuth2UserInfo.getEmail();
        String loginId = provider + "_" + providerId;
        String nickname = oAuth2UserInfo.getName();
        String profileImage = oAuth2UserInfo.getImagePath();
        if(profileImage == null){
            profileImage = "https://damda.s3.ap-northeast-2.amazonaws.com/profile.jpg";
        }

        log.info(email);
        log.info(loginId);
        log.info(nickname);
        log.info(profileImage);

        Optional<User> optionalUser = userRepository.findByEmail(email);
        User user = null;

        log.info(optionalUser.toString());

        if(optionalUser.isEmpty()){
            user = User.builder()
                    .accountType("KAKAO")
                    .email(email)
                    .userPw(encoder.encode(loginId))
                    .nickname(nickname)
                    .profileImage(profileImage)
                    .build();

            user = userRepository.save(user);
            System.out.println("유저없음"+user);
        }
        else{
            user = optionalUser.get();
            System.out.println("유저있음"+user);
            log.info("로그인 성공");
            log.info("로그인 성공2"+ user);
        }

        // 카카오 유저 로그인 로그 저장
        UserLog userLog = new UserLog();
        userLog.setUser(user);
        UserLog save = userLogRepository.save(userLog);

        //컨트롤러에서 유저 정보를 필요할때 그때 사용한다.
        return new PrincipalDetails(user, oAuth2User.getAttributes());

    }

}
