package com.b210.damda.util.kakaoAPI.service;

import com.b210.damda.domain.user.repository.UserRepository;
import com.b210.damda.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import com.b210.damda.domain.entity.User;

import java.nio.file.attribute.UserPrincipalLookupService;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class PrincipalOauth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder;
    private final UserService userService;

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

        log.info(email);
        log.info(loginId);
        log.info(nickname);

        Optional<User> optionalUser = userRepository.findByEmail(email);
        User user = null;

        log.info(optionalUser.toString());

        if(optionalUser.isEmpty()){
            user = User.builder()
                    .accountType("KAKAO")
                    .email(email)
                    .userPw(loginId)
                    .nickname(nickname)
                    .profileImage(profileImage)
                    .build();

            user = userRepository.save(user);
        }
        else{
            user = optionalUser.get();
            log.info("로그인 성공");
        }

        return new PrincipalDetails(user, oAuth2User.getAttributes());

    }

}
