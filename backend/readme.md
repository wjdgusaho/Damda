# 백엔드 실행 설정법

## 1. application.yml

### 카카오톡 Security Oauth2 설정
```JAVA
  security:
    oauth2:
      client:
        registration:
          kakao:
            client-id: 카카오톡 client-id
            client-secret: 카카오톡 로그인 client-secret 값
            scope:  //동의를 구할 목록
              - account_email
              - profile_nickname
              - profile_image
            authorization-grant-type: authorization_code
            redirect-uri: 로그인후 redirect로 정보를 받을 uri 주소
            client-name: Kakao
            client-authentication-method: POST

        provider:
          kakao:
            authorization-uri: https://kauth.kakao.com/oauth/authorize   // 카카오 인증 (로그인 유저 인증 코드 받음)
            token-uri: https://kauth.kakao.com/oauth/token               // 카카오 토큰 (로그인 유저 토큰 발급 받음)
            user-info-uri: https://kapi.kakao.com/v2/user/me             // 카카오 유저정보 (로그인 유저 정보 받음)
            user-name-attribute: id
```

## 2. JwtSuccessHandler / KakaoFallHandler

- response.sendRedirect
  url을 프론트 주소로 주시면 됩니다

  ex) "https://localhost:3000/login"
  
  ex) "https://localhost:3000/dummykakao?code=" + userCode
