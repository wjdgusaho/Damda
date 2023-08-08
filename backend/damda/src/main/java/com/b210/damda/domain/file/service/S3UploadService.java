package com.b210.damda.domain.file.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class S3UploadService {

    private final AmazonS3 amazonS3;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    public String profileSaveFile(MultipartFile multipartFile) throws IOException {
        String originalFilename = multipartFile.getOriginalFilename();

        String extension = originalFilename.substring(originalFilename.lastIndexOf(".")); // 파일 확장자
        String randomName = UUID.randomUUID().toString(); // 랜덤한 문자열 생성
        String newFilename = "user-profileImage/" + randomName + extension; // 랜덤한 문자열과 확장자를 합쳐서 새 파일명 생성

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(multipartFile.getSize());
        metadata.setContentType(multipartFile.getContentType());

        amazonS3.putObject(bucket, newFilename, multipartFile.getInputStream(), metadata);
        return amazonS3.getUrl(bucket, newFilename).toString();
    }

    public String cardSaveFile(MultipartFile multipartFile) throws IOException {
        String originalFilename = multipartFile.getOriginalFilename();

        String extension = originalFilename.substring(originalFilename.lastIndexOf(".")); // 파일 확장자
        String randomName = UUID.randomUUID().toString(); // 랜덤한 문자열 생성
        String newFilename = "timecapsule-card/" + randomName + extension; // 랜덤한 문자열과 확장자를 합쳐서 새 파일명 생성

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(multipartFile.getSize());
        metadata.setContentType(multipartFile.getContentType());

        amazonS3.putObject(bucket, newFilename, multipartFile.getInputStream(), metadata);
        return amazonS3.getUrl(bucket, newFilename).toString();
    }

    public String fileSaveFile(MultipartFile multipartFile) throws IOException {
        String originalFilename = multipartFile.getOriginalFilename();

        String extension = originalFilename.substring(originalFilename.lastIndexOf(".")); // 파일 확장자
        String randomName = UUID.randomUUID().toString(); // 랜덤한 문자열 생성
        String newFilename = "timecapsule-file/" + randomName + extension; // 랜덤한 문자열과 확장자를 합쳐서 새 파일명 생성

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(multipartFile.getSize());
        metadata.setContentType(multipartFile.getContentType());

        amazonS3.putObject(bucket, newFilename, multipartFile.getInputStream(), metadata);
        return amazonS3.getUrl(bucket, newFilename).toString();
    }

    public ResponseEntity<UrlResource> downloadImage(String originalFilename) {
        UrlResource urlResource = new UrlResource(amazonS3.getUrl(bucket, originalFilename));

        String contentDisposition = "attachment; filename=\"" +  originalFilename + "\"";

        // header에 CONTENT_DISPOSITION 설정을 통해 클릭 시 다운로드 진행
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition)
                .body(urlResource);
    }

    public String saveFileBase64(byte[] data, String filename) throws IOException {
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(data.length);
        // 또한 이미지인 경우 ContentType을 적절히 설정해야합니다.
        // 이 예제에서는 JPEG 이미지를 가정합니다.

        String extension = filename.substring(filename.lastIndexOf(".")).toLowerCase(); // 파일 확장자
        String contentType = "image/jpeg";
        if (".png".equals(extension)) {
            contentType = "image/png";
        }
        metadata.setContentType(contentType);

        // ByteArrayInputStream을 사용하여 byte[]를 InputStream으로 변환
        ByteArrayInputStream inputStream = new ByteArrayInputStream(data);

        String randomName = UUID.randomUUID().toString(); // 랜덤한 문자열 생성
        String newFilename = randomName + extension; // 랜덤한 문자열과 확장자를 합쳐서 새 파일명 생성

        amazonS3.putObject(bucket, newFilename, inputStream, metadata);
        return amazonS3.getUrl(bucket, newFilename).toString();
    }
}