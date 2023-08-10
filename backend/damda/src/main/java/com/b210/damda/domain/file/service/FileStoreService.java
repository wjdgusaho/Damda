package com.b210.damda.domain.file.service;

import com.amazonaws.services.s3.transfer.MultipleFileDownload;
import com.amazonaws.services.s3.transfer.TransferManager;
import com.amazonaws.services.s3.transfer.TransferProgress;
import com.b210.damda.domain.file.util.FileUtil;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;
import java.text.DecimalFormat;
import java.time.Instant;
import java.util.UUID;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
@Slf4j

public class FileStoreService {

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;
    private final TransferManager transferManager;

    @Autowired
    public FileStoreService(TransferManager transferManager) {
        this.transferManager = transferManager;
    }

    public void downloadZip2(String prefix, HttpServletResponse response) throws IOException, InterruptedException {

        // (1)
        // 서버 로컬에 생성되는 디렉토리, 해당 디렉토리에 파일이 다운로드된다
        File localDirectory = new File(RandomStringUtils.randomAlphanumeric(6) + "-s3-download.zip");

        try (ZipOutputStream zipOut = new ZipOutputStream(response.getOutputStream())) {
            // (2)
            // TransferManager -> localDirectory에 파일 다운로드
            MultipleFileDownload downloadDirectory = transferManager.downloadDirectory(bucket, prefix, localDirectory);

            // (3)
            // 다운로드 상태 확인
            log.info("[" + prefix + "] download progressing... start");
            DecimalFormat decimalFormat = new DecimalFormat("##0.00");
            while (!downloadDirectory.isDone()) {
                Thread.sleep(1000);
                TransferProgress progress = downloadDirectory.getProgress();
                double percentTransferred = progress.getPercentTransferred();
                log.info("[" + prefix + "] " + decimalFormat.format(percentTransferred) + "% download progressing...");
            }
            log.info("[" + prefix + "] download directory from S3 success!");

            // (4)
            // 로컬 디렉토리 -> 압축하면서 다운로드
            log.info("compressing to zip file...");
            addFolderToZip(zipOut, localDirectory);
        } finally {
            // (5)
            // 로컬 디렉토리 삭제
            FileUtil.remove(localDirectory);
        }
    }

    private void addFolderToZip(ZipOutputStream zipOut, File localDirectory) throws IOException {
        final int INPUT_STREAM_BUFFER_SIZE = 2048;
        Files.walkFileTree(Paths.get(localDirectory.getName()), new SimpleFileVisitor<>() {
            @Override
            public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) throws IOException {
                if (attrs.isSymbolicLink()) {
                    return FileVisitResult.CONTINUE;
                }

                try (FileInputStream fis = new FileInputStream(file.toFile())) {
                    Path targetFile = Paths.get(localDirectory.getName()).relativize(file);
                    ZipEntry zipEntry = new ZipEntry(targetFile.toString());
                    zipOut.putNextEntry(zipEntry);

                    byte[] bytes = new byte[INPUT_STREAM_BUFFER_SIZE];
                    int length;
                    while ((length = fis.read(bytes)) >= 0) {
                        zipOut.write(bytes, 0, length);
                    }
                    zipOut.closeEntry();
                }
                return FileVisitResult.CONTINUE;
            }

            @Override
            public FileVisitResult visitFileFailed(Path file, IOException exc) {
                System.err.printf("Unable to zip : %s%n%s%n", file, exc);
                return FileVisitResult.CONTINUE;
            }
        });
    }

}
