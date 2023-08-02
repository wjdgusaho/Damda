package com.b210.damda.domain.entity.Timecapsule;

import com.b210.damda.domain.dto.MainTimecapsuleListDTO;
import com.b210.damda.domain.dto.SaveTimecapsuleListDTO;
import com.b210.damda.domain.dto.Timecapsule.TimecapsuleShopDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Getter @Setter
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Builder
public class Timecapsule {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long timecapsuleNo;

    private Timestamp openDate;

    private String type;

    private String title;

    private String description;

    private Timestamp removeDate;

    private Timestamp registDate;

    private Long maxFileSize;

    @Builder.Default
    @Column(nullable = false, columnDefinition = "bigint default 0")
    private Long nowFileSize = 0L;

    private int maxParticipant;

    private int nowParticipant;

    private String inviteCode;

    private int capsuleIconNo;

    @Builder.Default
    @Column(nullable = false, columnDefinition = "integer default 0")
    private int goalCard = 0;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "criteria_id")
    private TimecapsuleCriteria timecapsuleCriteria;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "timecapsule_penalty_no")
    private TimecapsulePenalty timecapsulePenalty;

    public Timecapsule(){

    }

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
                .endDate(this.getType().equals("GOAL") ? null : this.openDate)
                .title(this.title)
                .capsuleIconNo(this.capsuleIconNo)
                .goalCard(this.getType().equals("GOAL") ? this.goalCard : 0)

                .build();
    }

}
