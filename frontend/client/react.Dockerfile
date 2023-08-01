# 빌드 단계
# 베이스 이미지 설정
FROM node:18.17.0-alpine AS build

# 작업 디렉토리 설정
WORKDIR /app

# 앱 의존성 설치
COPY package.json package-lock.json ./
RUN npm install

# 앱 소스 코드 복사
COPY . .

# 앱 빌드
RUN npm run build

# 실행 단계
# Nginx를 사용하여 정적 파일 서빙
FROM nginx:1.21.3-alpine

# 호스트의 Nginx 설정 파일 복사 (여기에서 /path/to/nginx.conf는 호스트의 nginx.conf 파일 경로를 지정합니다)
COPY nginx.conf /etc/nginx/nginx.conf

# 정적 파일 복사
COPY --from=build /app/build /usr/share/nginx/html

# Nginx 실행
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
