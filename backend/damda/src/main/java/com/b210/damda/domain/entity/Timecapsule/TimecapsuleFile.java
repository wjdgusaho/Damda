package com.b210.damda.domain.entity.Timecapsule;


import com.b210.damda.domain.entity.User.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Setter
@Getter
@Builder
@AllArgsConstructor
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
}
