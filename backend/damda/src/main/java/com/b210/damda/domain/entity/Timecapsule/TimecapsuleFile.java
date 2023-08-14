package com.b210.damda.domain.entity.Timecapsule;


import com.b210.damda.domain.entity.User.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import javax.persistence.*;
import java.sql.Timestamp;
import java.time.LocalDateTime;

@Entity
@Getter
public class TimecapsuleFile {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long timecapsuleFileNo;

    @ManyToOne
    @JoinColumn(name = "timecapsule_no")
    private Timecapsule timecapsule;

    private String filePath;

    private String fileName;

    private Timestamp createTime;

    @ManyToOne
    @JoinColumn(name = "user_no")
    private User user;

    private Long fileSize;


    public  TimecapsuleFile(){
    }

    public void createTimecapsuleFile(String fileUrl, Timecapsule timecapsule, User user, MultipartFile file) {
        this.filePath = fileUrl;
        this.createTime = Timestamp.valueOf(LocalDateTime.now());
        this.timecapsule = timecapsule;
        this.user = user;
        this.fileSize = file.getSize();
        this.fileName = file.getName();
    }
}
