package com.b210.damda.domain.file.controller;

import com.b210.damda.domain.file.service.FileStoreService;
import com.b210.damda.domain.file.service.S3UploadService;
import com.b210.damda.util.exception.CommonException;
import com.b210.damda.util.response.DataResponse;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;

@Controller
@RequestMapping("/s3")
public class S3Controller {

    private final S3UploadService s3Service;
    private final FileStoreService fileStoreService;

    @Autowired
    public S3Controller(S3UploadService s3Service, FileStoreService fileStoreService) {
        this.s3Service = s3Service;
        this.fileStoreService = fileStoreService;
    }

    // 타임캡슐 파일 저장
    @GetMapping(value = "/download/zip/timecapsule/{timecapsuleNo}/file")
    public ResponseEntity<DataResponse<Map<String, Object>>> downloadZip(@PathVariable("timecapsuleNo") Long timecapsuleNo, HttpServletRequest request, HttpServletResponse response) throws IOException, InterruptedException {
        try{
            String prefix = getPrefix(request.getRequestURI(), "/s3/download/zip/");
            fileStoreService.downloadZip(prefix, response, timecapsuleNo);
            // 정상적인 경우
            return new ResponseEntity<>(new DataResponse<>(200, "다운로드 성공"),
                    HttpStatus.OK);
        }catch (CommonException e) {
            // 예외 상황에 따른 ResponseEntity 반환
            return new ResponseEntity<>(new DataResponse<>(e.getCustomExceptionStatus().getCode(), e.getCustomExceptionStatus().getMessage()),
                    HttpStatus.OK);
        } catch (Exception e) {
            // 기타 예외 처리
            return new ResponseEntity<>(new DataResponse<>(500, "알 수 없는 에러가 발생했습니다. 잠시 후 다시 시도해주세요."), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // 타임캡슐 카드 저장
    @GetMapping("/download/timecapsule/{timecapsuleNo}/timecapsule-card/{timecapsuleCardNo}")
    public ResponseEntity<byte[]> downloadImage(@PathVariable("timecapsuleCardNo") Long timecapsuleCardNo, @PathVariable("timecapsuleNo")
                                                Long timecapsuleNo) throws IOException {

        System.out.println(timecapsuleCardNo);
        System.out.println(timecapsuleNo);
        System.out.println(fileStoreService.getObject(timecapsuleCardNo, timecapsuleNo));
        return fileStoreService.getObject(timecapsuleCardNo, timecapsuleNo);
    }

    private String getPrefix(String uri, String regex) {
        String[] split = uri.split(regex);
        return split.length < 2 ? "" : split[1];
    }

}

