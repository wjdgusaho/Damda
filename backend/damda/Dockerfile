# AdoptOpenJDK의 JDK 이미지를 기반으로 사용합니다.
FROM adoptopenjdk:11-jdk-hotspot AS build

# 작업 디렉토리를 /app으로 설정합니다.
WORKDIR /app

# 호스트의 빌드된 JAR 파일을 이미지에 복사합니다.
COPY damda-0.0.1-SNAPSHOT.jar /app/app.jar

# 컨테이너가 시작되었을 때 실행할 명령어를 지정합니다.
CMD ["java", "-jar", "/app/app.jar"]
