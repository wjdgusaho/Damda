package com.b210.damda.domain.file.controller;

import com.b210.damda.domain.file.service.FileStoreService;
import com.b210.damda.domain.file.service.S3UploadService;
import com.b210.damda.util.exception.CommonException;
import com.b210.damda.util.response.DataResponse;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;

@RestController
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
    @GetMapping(value = "/download/zip/timecapsule/{timecapsuleNo}/file", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public DataResponse<Map<String, Object>> downloadZip(@PathVariable("timecapsuleNo") Long timecapsuleNo, HttpServletRequest request, HttpServletResponse response) throws IOException, InterruptedException {
        try{
            response.setStatus(HttpServletResponse.SC_OK);
            response.addHeader("Content-Disposition", "attachment; filename=" + new String((RandomStringUtils.randomAlphanumeric(6) + "-s3-download.zip").getBytes("UTF-8"), "ISO-8859-1"));
            String prefix = getPrefix(request.getRequestURI(), "/s3/download/zip/");
            fileStoreService.downloadZip(prefix, response, timecapsuleNo);

            return new DataResponse<>(200, "타임캡슐 파일 다운로드 성공");
        }catch (CommonException e){
            return new DataResponse<>(e.getCustomExceptionStatus().getCode(), e.getCustomExceptionStatus().getMessage());
        }catch (Exception e){
            return new DataResponse<>(500, "알 수 없는 에러가 발생하였습니다. 잠시 후 다시 시도해주세요.");
        }
    }

    @GetMapping("/download/image/timecapsule/{timecapsuleCardNo}/image")
    public ResponseEntity<byte[]> downloadImage(@PathVariable("timecapsuleCardNo") Long timecapsuleCardNo) throws IOException {
        return fileStoreService.getObject(timecapsuleCardNo);
    }

    private String getPrefix(String uri, String regex) {
        String[] split = uri.split(regex);
        return split.length < 2 ? "" : split[1];
    }
}