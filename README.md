# <img src="exec/img/popup.png" width="50">서로의 추억을 담고 공유하는 타임캡슐 서비스<img src="exec/img/popup.png" width="50">
<img src="exec/img/EMAIL_CONFIRM.png" width="800" height="250">

# 1️⃣ **프로젝트 개요**

### ❤**개발 기간**❤
| 개발기간 | 2023.07.10 ~ 2023.08.18 (6주) |
| --- | --- |

### 💙**팀원 소개**💙

| 팀원 | 역할 |
| --- | --- |
| 신창학 | 팀장, BE, DB, Infra, 발표 |
| 정현모 | BE, FE, DB, 로직 |
| 박기현 | BE, DB, 로직 |
| 이지영 | FE, 디자인, 로직, PPT |
| 권소정 | FE, 디자인, UCC, PPT, 로직 |
| 차영범 | FE, 로직, DB, 요정 |

### 💛**기획 배경**💛
```
핵심 : 핫하고 캐주얼한 컨텐츠와 현대인에게 필요한 감성을 결합하여 제공

- 대충 현대인에게 감성이 필요하다는 것(문제상황)
- 캐주얼한 컨텐츠가 핫하다는걸 강조

롤링페이퍼, 심리테스트 등
```

### 💜**목표**💜
```
담다 타임캡슐 서비스를 통해 많은 사람들이 추억을 공유하고 즐거움을 느끼는 것이 목표입니다.
```

<hr>

# 2️⃣ **서비스 소개**
> **회원가입**

> **로그인**

> **친구 요청 알람**

> **테마, 스티커 구매**

> **클래식 타임캡슐 만들기**

> **기록 타임캡슐 만들기**

> **목표 타임캡슐 만들기**

> **목표 타임캡슐 만들기**

> **타임캡슐 초대받기 알람**

> **카드 작성**

> **타임캡슐 열기**

> **테마 변경**


<hr>

# 3️⃣ **개발 환경**

# 개발 환경

## ⚙ Management Tool
- 형상 관리 : Gitlab
- 이슈 관리 : Jira
- 커뮤니케이션 : Mattermost, Notion, Discord
- 디자인 : Figma, Canva

<br>

## 💻 IDE
- Visual Studio Code
- Intellij CE 2023.1.3

<br>

## 📱 Frontend
- Node.js `18.16.1` LTS
- React `18.2.0`
  - React-canvas-confetti `1.4.0`
  - React-cookie `4.1.1`
  - react-datepicker `4.16.0`
  - react-dom `18.2.0`
  - react-hot-toast `2.4.1`
  - react-minimal-pie-chart `8.4.0`
  - react-modal `3.16.1`
  - react-redux `8.1.1`
  - react-router-dom `6.14.1`
  - react-scripts `5.0.1`
  - react-slick `0.29.0`
  - react-toastify `9.1.3`
  - redux-persist `6.0.0`
  - redux-thunk `2.4.2`
  - slick-carousel `1.8.1`
  - styled-components `6.0.4`
  - Redux RTK `1.9.1`
- TypeScript `4.9.5`
- axios `1.4.0`
- email-validator `2.0.4`
- event-source-polyfill `1.0.31`
- html2canvas `1.4.1`
- TailwindCss `3.3.3`
  - TailwindCss-styled-component `2.2.0`

<br>

## 📁 Backend

- Springboot `2.7.13`
- Lombok
- Spring Data JPA 
- Spring Data Redis(lettuce)
- Spring Web
- Spring cloud(spring cloud gateway, spring cloud eureka, spring cloud config server) `3.1.3`
- QueryDSL
- webflux, netty
- Springdoc-openapi-starter-webmvc-ui `2.0.0`
- Oauth2
- WebSocket
- Redis
- MySql
- Swagger `3.0.0`
- SSL
- CertBot(CA Certificates)`

## 💾 Database

- MySQL

## 🌁 Infra

- Jenkins 2.401.3
- docker-compose
- SSL
- CertBot

## 🎞 Storage

- AWS S3

<br><br><br>

# 설계 문서

## 🎨 와이어프레임
[Figma](https://www.figma.com/file/KfTJUuphqmJRK5it8h6aMr/Untitled?type=design&node-id=0-1&mode=design&t=z88hDAL0fIBs31uK-0)
<br>
![와이어프레임](https://user-images.githubusercontent.com/67595512/222054321-e949c313-91c6-4909-9a5c-95d477ceded2.PNG)

<br><br>

## 📃 요구사항 정의서
[Notion](https://steady-volcano-b48.notion.site/0870f776b4fc47eeb4bde9526394b5ad?pvs=4)
![image](https://user-images.githubusercontent.com/67595512/222136921-99535ad0-30d7-4d19-aae8-389b3d71078b.png)


<br><br>

## 📝 API 명세서
[Notion](https://steady-volcano-b48.notion.site/056c428abbeb4d1f9682fc0d94c65ea4?pvs=4)
![API명세서](https://user-images.githubusercontent.com/67595512/222057116-108c4c5e-f6c4-40d8-a7ba-aecab016d7e7.PNG)


<br><br>

## 📏 ERD
![erd](https://www.erdcloud.com/d/bKhfPnxa3Cvx89cSN)

<br><br>

## 📐 시스템 아키텍처
![아키텍처](https://user-images.githubusercontent.com/67595512/222055377-513a10d6-2024-4864-a9d9-e4fee05144d0.png)


<br><br>
