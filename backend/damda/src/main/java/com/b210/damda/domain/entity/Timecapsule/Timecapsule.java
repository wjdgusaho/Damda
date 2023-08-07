package com.b210.damda.domain.entity.Timecapsule;

import com.b210.damda.domain.dto.Timecapsule.MainTimecapsuleListDTO;
import com.b210.damda.domain.dto.Timecapsule.SaveTimecapsuleListDTO;
import com.b210.damda.domain.dto.Timecapsule.TimecapsuleDetailDTO;
import com.b210.damda.domain.dto.Timecapsule.TimecapsuleShopDTO;
import lombok.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.sql.Timestamp;
import java.time.format.DateTimeFormatter;

@Entity
@Getter @Setter
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Builder
@ToString
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

    @Column(columnDefinition = "integer default 1")
    private int nowParticipant = 1;

    @Column(name="invite_code")
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
        DateTimeFormatter Dateformatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm:ss");
        return MainTimecapsuleListDTO.builder()
                .timecapsuleNo(this.timecapsuleNo)
                .type(this.type)
                .sDate(this.registDate.toLocalDateTime().format(Dateformatter))
                .eDate(this.openDate == null ? null : this.openDate.toLocalDateTime().format(Dateformatter))
                //.sTime(this.registDate.toLocalDateTime().format(timeFormatter))
                //.eTime(this.openDate == null ? null : this.openDate.toLocalDateTime().format(timeFormatter))
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

    public TimecapsuleDetailDTO toTimecapsuleDetailDTO(){
        return TimecapsuleDetailDTO.builder()
                .timecapsuleNo(this.timecapsuleNo)
                .registDate(this.registDate)
                .openDate(this.openDate)
                .title(this.title)
                .description(this.description)
                .capsuleIcon("capsule"+this.capsuleIconNo)
                .capsuleType(this.type)
                .inviteCode(this.inviteCode)
                .maxParticipant(this.maxParticipant)
                .nowParticipant(this.nowParticipant)
                .goalCard(this.goalCard)
                .penalty(this.timecapsulePenalty.getPenalty() == false ? null : this.timecapsulePenalty.toTimecapsulePenaltyDTO())
                .criteriaInfo(this.timecapsuleCriteria.toTimecapsuleCriteriaDTO())
                .build();
    }

    // 현재 타임캡슐 인원 +1
    public void updateNowParticipant(){
        this.nowParticipant = nowParticipant + 1;
    }

}
