package com.b210.damda.domain.file.controller;

import com.b210.damda.domain.file.service.FileStoreService;
import com.b210.damda.domain.file.service.S3UploadService;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

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

    @GetMapping(value = "/download/zip2/**", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public void downloadZip2(HttpServletRequest request, HttpServletResponse response) throws IOException, InterruptedException {
        response.setStatus(HttpServletResponse.SC_OK);
        response.addHeader("Content-Disposition", "attachment; filename=" + new String((RandomStringUtils.randomAlphanumeric(6) + "-s3-download.zip").getBytes("UTF-8"), "ISO-8859-1"));
        String prefix = getPrefix(request.getRequestURI(), "/s3/download/zip2/");
        fileStoreService.downloadZip2(prefix, response);
    }

    private String getPrefix(String uri, String regex) {
        String[] split = uri.split(regex);
        return split.length < 2 ? "" : split[1];
    }
}