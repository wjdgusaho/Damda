package com.b210.damda.domain.entity;

import com.b210.damda.domain.dto.ThemeShopDTO;
import com.b210.damda.domain.dto.TimecapsuleShopDTO;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
@Getter
@Setter
public class Timecapsule {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long timecapsuleNo;

    private String openDate;

    private String type;

    private String title;

    private String description;

    private String removeDate;

    private String registDate;

    private long maxFileSize;

    private long nowFileSize;

    private int maxParticipant;

    private int nowParticipant;

    private String inviteCode;

    private boolean penalty;

    private int capsuleIconNo;

    //캡슐 아이콘 no 변경해줘야함!
    public TimecapsuleShopDTO toTimecapsuleShopDTO(){
        return TimecapsuleShopDTO.builder()
                .timecapsuleNo(this.timecapsuleNo)
                .maxFileSize(this.maxFileSize)
                .nowFileSize(this.nowFileSize)
                .title(this.title)
                .capsuleIconNo(this.capsuleIconNo)
                .build();
    }


}
