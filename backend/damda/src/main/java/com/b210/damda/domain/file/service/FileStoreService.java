package com.b210.damda.domain.file.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.GetObjectRequest;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import com.amazonaws.services.s3.transfer.MultipleFileDownload;
import com.amazonaws.services.s3.transfer.TransferManager;
import com.amazonaws.services.s3.transfer.TransferProgress;
import com.amazonaws.util.IOUtils;
import com.b210.damda.domain.entity.Timecapsule.Timecapsule;
import com.b210.damda.domain.entity.Timecapsule.TimecapsuleCard;
import com.b210.damda.domain.entity.Timecapsule.TimecapsuleFile;
import com.b210.damda.domain.entity.Timecapsule.TimecapsuleMapping;
import com.b210.damda.domain.entity.User.User;
import com.b210.damda.domain.file.util.FileUtil;
import com.b210.damda.domain.timecapsule.repository.TimecapsuleCardRepository;
import com.b210.damda.domain.timecapsule.repository.TimecapsuleFileRepository;
import com.b210.damda.domain.timecapsule.repository.TimecapsuleMappingRepository;
import com.b210.damda.domain.timecapsule.repository.TimecapsuleRepository;
import com.b210.damda.domain.user.repository.UserRepository;
import com.b210.damda.util.exception.CommonException;
import com.b210.damda.util.exception.CustomExceptionStatus;
import com.b210.damda.util.response.DataResponse;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.ConnectException;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;
import java.text.DecimalFormat;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
@Slf4j

public class FileStoreService {

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;
    private final TransferManager transferManager;
    private final TimecapsuleMappingRepository timecapsuleMappingRepository;
    private final UserRepository userRepository;
    private final TimecapsuleRepository timecapsuleRepository;
    private final AmazonS3 amazonS3;
    private final TimecapsuleCardRepository timecapsuleCardRepository;
    private final TimecapsuleFileRepository timecapsuleFileRepository;

    @Autowired
    public FileStoreService(TransferManager transferManager, TimecapsuleMappingRepository timecapsuleMappingRepository,
                            UserRepository userRepository, TimecapsuleRepository timecapsuleRepository, AmazonS3 amazonS3,
                            TimecapsuleCardRepository timecapsuleCardRepository, TimecapsuleFileRepository timecapsuleFileRepository) {
        this.transferManager = transferManager;
        this.timecapsuleMappingRepository = timecapsuleMappingRepository;
        this.userRepository = userRepository;
        this.timecapsuleRepository = timecapsuleRepository;
        this.amazonS3 = amazonS3;
        this.timecapsuleCardRepository = timecapsuleCardRepository;
        this.timecapsuleFileRepository = timecapsuleFileRepository;
    }

    /*
        유저정보 불러오기
     */
    public Long getUserNo(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();
        Long userNo = (Long) principal;

        return userNo;
    }

    public DataResponse<Map<String, Object>> downloadZip(String prefix, HttpServletResponse response, Long timecapsuleNo) throws IOException {
            // 현재 유저 찾음
        Long userNo = getUserNo();
            User user = userRepository.findById(userNo).get();

            // 현재 타임캡슐 찾음
            Optional<Timecapsule> timecapsuleFind = timecapsuleRepository.findById(timecapsuleNo);
            // 타임캡슐이 존재하지 않으면
            if (timecapsuleFind.isEmpty()) {
                throw new CommonException(CustomExceptionStatus.NOT_TIMECAPSULE);
            }

            Timecapsule timecapsule = timecapsuleFind.get();

            // 해당 유저의 타임캡슐이 아님
            TimecapsuleMapping timecapsuleMapping = timecapsuleMappingRepository.findByUserAndTimecapsuleGet(user, timecapsule);
            if (timecapsuleMapping == null) {
                throw new CommonException(CustomExceptionStatus.NOT_USER_TIMECAPSULE);
            }

            // 삭제된 타임캡슐
            if (timecapsuleMapping.getDeleteDate() != null) {
                throw new CommonException(CustomExceptionStatus.DELETE_TIMECAPSULE);
            }

            // 열리지 않은 타임캡슐
            if(timecapsuleMapping.getSaveDate() == null || !timecapsuleMapping.isSave()){
               throw new CommonException(CustomExceptionStatus.NOT_OPEN_TIMECAPSULE);
            }

            // 타임캡슐에 파일이 없으면
            List<TimecapsuleFile> byTimecapsule = timecapsuleFileRepository.getByTimecapsule(timecapsule);
            if (byTimecapsule.size() == 0) {
                throw new CommonException(CustomExceptionStatus.NOT_FOUND_FILE);
            }

            // (1)
            // 서버 로컬에 생성되는 디렉토리, 해당 디렉토리에 파일이 다운로드된다
            response.setStatus(HttpServletResponse.SC_OK);
            response.setContentType(MediaType.APPLICATION_OCTET_STREAM_VALUE);
            response.addHeader("Content-Disposition", "attachment; filename=" + new String((RandomStringUtils.randomAlphanumeric(6) + "-s3-download.zip").getBytes("UTF-8"), "ISO-8859-1"));
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
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            } finally {
                // (5)
                // 로컬 디렉토리 삭제
                FileUtil.remove(localDirectory);
            }
            return new DataResponse<>(200, "성공");

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

    // 카드 사진 다운로드
    public ResponseEntity<byte[]> getObject(Long timecapsuleCardNo, Long timecapsuleNo) throws IOException{

        // 현재 유저
        Long userNo = getUserNo();
        User user = userRepository.findById(userNo).get();

        // 타임캡슐이 없으면
        Optional<Timecapsule> byTimecapsule = timecapsuleRepository.findById(timecapsuleNo);
        if(byTimecapsule.isEmpty()){
            throw new CommonException(CustomExceptionStatus.NOT_TIMECAPSULE);
        }

        Timecapsule timecapsule = byTimecapsule.get();

        // 해당 유저의 타임캡슐이 아님
        TimecapsuleMapping timecapsuleMapping = timecapsuleMappingRepository.findByUserAndTimecapsuleGet(user, timecapsule);
        if(timecapsuleMapping == null){
            throw new CommonException(CustomExceptionStatus.NOT_USER_TIMECAPSULE);
        }

        // 삭제된 타임캡슐
        if(timecapsuleMapping.getDeleteDate() != null){
            throw new CommonException(CustomExceptionStatus.DELETE_TIMECAPSULE);
        }

        // 열리지 않은 타임캡슐
        if(timecapsuleMapping.getSaveDate() == null || !timecapsuleMapping.isSave()){
            throw new CommonException(CustomExceptionStatus.NOT_OPEN_TIMECAPSULE);
        }

        // 카드가 없음
        Optional<TimecapsuleCard> findCard = timecapsuleCardRepository.findById(timecapsuleCardNo);
        if(findCard.isEmpty()){
            throw new CommonException(CustomExceptionStatus.NOT_CARD);
        }

        TimecapsuleCard timecapsuleCard = findCard.get();

        // 해당 타임캡슐 카드가 현재 타임캡슐 번호에 속하는지판단
        if(!timecapsuleCard.getTimecapsule().getTimecapsuleNo().equals(timecapsuleNo)){
            throw new CommonException(CustomExceptionStatus.NOT_MATCH_TIMECAPSULE_CARD);
        }

        String imagePath = timecapsuleCard.getImagePath();

        if (imagePath.startsWith("https://")) {
            URL url = new URL(imagePath);
            imagePath = url.getPath().substring(1);  // 첫번째 '/'를 제거하기 위해 substring 사용
        }

        S3Object o = amazonS3.getObject(new GetObjectRequest(bucket, imagePath));
        S3ObjectInputStream objectInputStream = o.getObjectContent();
        byte[] bytes = IOUtils.toByteArray(objectInputStream);

        String fileName = URLEncoder.encode(imagePath, "UTF-8").replaceAll("\\+", "%20");
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        httpHeaders.setContentLength(bytes.length);
        httpHeaders.setContentDispositionFormData("attachment", fileName);

        return new ResponseEntity<>(bytes, httpHeaders, HttpStatus.OK);

    }

}
