package com.b210.damda.domain.entity;

import com.b210.damda.domain.dto.MainTimecapsuleListDTO;
import com.b210.damda.domain.dto.SaveTimecapsuleListDTO;
import com.b210.damda.domain.dto.ThemeShopDTO;
import com.b210.damda.domain.dto.TimecapsuleShopDTO;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
public class Timecapsule {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long timecapsuleNo;

    private String openDate;

    private String type;

    private String title;

    private String description;

    private String removeDate;

    private String registDate;

    private Long maxFileSize;

    private Long nowFileSize;

    private int maxParticipant;

    private int nowParticipant;

    private String inviteCode;

    private boolean penalty;

    private int capsuleIconNo;

    private int goalCard;

    /*
        상점에서 타임캡슐 목록 불러올경우
     */
    public TimecapsuleShopDTO toTimecapsuleShopDTO(){
        return TimecapsuleShopDTO.builder()
                .timecapsuleNo(this.timecapsuleNo)
                .maxFileSize(this.maxFileSize)
                .nowFileSize(this.nowFileSize)
                .title(this.title)
                .capsuleIconNo(this.capsuleIconNo)
                .build();
    }

    /*
        메인화면에서 타임캡슐 목록 불러올경우
     */
    public MainTimecapsuleListDTO toMainTimecapsuleListDTO(){
        return MainTimecapsuleListDTO.builder()
                .timecapsuleNo(this.timecapsuleNo)
                .type(this.type)
                .sDate(this.registDate)
                .eDate(this.openDate)
                .name(this.title)
                .capsuleIconNo(this.capsuleIconNo)
                .goalCard(this.goalCard)
                .build();
    }

    public SaveTimecapsuleListDTO toSaveTimecapsuleListDTO(){
        return SaveTimecapsuleListDTO.builder()
                .timecapsuleNo(this.timecapsuleNo)
                .type(this.type)
                .startDate(this.registDate)
                .endDate(this.openDate)
                .title(this.title)
                .capsuleIconNo(this.capsuleIconNo)
                .goalCard(this.goalCard)
                .curCard(this.goalCard) //저장되었다는건 (이미 목표를 달성했기 때문)
                .build();
    }

}
