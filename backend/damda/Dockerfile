# AdoptOpenJDK의 JDK 이미지를 기반으로 사용합니다.
FROM adoptopenjdk:11-jdk-hotspot AS build

# 작업 디렉토리를 /app으로 설정합니다.
WORKDIR /app

# 호스트의 빌드된 JAR 파일을 이미지에 복사합니다.
COPY /build/libs/damda-0.0.1-SNAPSHOT.jar /app/app.jar

# 애플리케이션 실행을 위해 필요한 의존성을 설치합니다.
# (예: 따로 필요한 경우만 추가하세요)
# 현재는 프로젝트의 의존성을 build.gradle 또는 pom.xml과 같은 빌드 파일에 작성하므로 따로 추가할 필요는 없다.
# 여기 적는 경우는 특별한 경우이다.  
# Spring Boot 프로젝트에서 사용하는 외부 라이브러리 중에는 컨테이너 내부에서 설치해야 하는 경우가 있을 수 있다.
# 이 경우  Dockerfile에 apt-get, yum, apk 등을 이용하여 컨테이너 내부에서 필요한 패키지를 설치하는 명령을 추가해야 한다.

# 컨테이너가 시작되었을 때 실행할 명령어를 지정합니다.
CMD ["java", "-jar", "/app/app.jar"]