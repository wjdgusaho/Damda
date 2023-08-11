package com.b210.damda.domain.file.controller;

import com.b210.damda.domain.file.service.FileStoreService;
import com.b210.damda.domain.file.service.S3UploadService;
import com.b210.damda.util.exception.CommonException;
import com.b210.damda.util.response.DataResponse;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
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
    @GetMapping(value = "/download/zip/timecapsule/{timecapsuleNo}/file", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public void downloadZip(@PathVariable("timecapsuleNo") Long timecapsuleNo, HttpServletRequest request, HttpServletResponse response) throws IOException, InterruptedException {
        response.setStatus(HttpServletResponse.SC_OK);
        response.addHeader("Content-Disposition", "attachment; filename=" + new String((RandomStringUtils.randomAlphanumeric(6) + "-s3-download.zip").getBytes("UTF-8"), "ISO-8859-1"));
        String prefix = getPrefix(request.getRequestURI(), "/s3/download/zip2/");
        fileStoreService.downloadZip(prefix, response, timecapsuleNo);
    }

    @GetMapping("/download/timecapsule-card/{timecapsuleCardNo}/image")
    public ResponseEntity<byte[]> downloadImage(@PathVariable("timecapsuleCardNo") Long timecapsuleCardNo) throws IOException {
        return fileStoreService.getObject(timecapsuleCardNo);
    }

    private String getPrefix(String uri, String regex) {
        String[] split = uri.split(regex);
        return split.length < 2 ? "" : split[1];
    }
}