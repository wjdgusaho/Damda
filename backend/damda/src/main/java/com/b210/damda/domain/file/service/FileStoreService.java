package com.b210.damda.domain.file.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.util.UUID;

@Service
public class FileStoreService {

    private final Path fileStorageLocation = Paths.get("C:/new");

    public String storeFile(MultipartFile file) {
        try {
            System.out.println(file.toString());
            // 원래 파일 이름에서 확장자 분리
            String originalFileName = file.getOriginalFilename();
            String extension = originalFileName.substring(originalFileName.lastIndexOf("."));

            // UUID 생성
            String uuid = UUID.randomUUID().toString();

            // 현재 시간을 밀리초 단위로 가져옴
            long millis = Instant.now().toEpochMilli();

            // 새로운 파일 이름 생성
            String newFileName = uuid + "_" + millis + extension;

            // 파일 저장
            try (InputStream is = file.getInputStream()) {
                Path targetLocation = this.fileStorageLocation.resolve(newFileName);
                Files.copy(is, targetLocation);
            }
            // 저장된 파일의 경로 반환
            return newFileName;
        } catch (Exception ex) {
            throw new RuntimeException("Could not store file " + file.getOriginalFilename() + ". Please try again!", ex);
        }
    }
}
