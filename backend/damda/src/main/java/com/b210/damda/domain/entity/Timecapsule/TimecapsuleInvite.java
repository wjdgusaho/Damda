package com.b210.damda.domain.entity.Timecapsule;

import com.b210.damda.domain.entity.User.User;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@ToString
@EntityListeners(AuditingEntityListener.class)
@Builder
public class TimecapsuleInvite {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long inviteTcNo;
    @ManyToOne
    @JoinColumn(name = "timecapsule_no")
    private Timecapsule timecapsule;
    private Long guestUserNo;
    private String status;
    @CreatedDate
    private LocalDateTime requestDate;
    @ManyToOne
    @JoinColumn(name = "timecapsule_penalty_no")
    private TimecapsulePenalty timecapsulePenalty;
    @ManyToOne
    @JoinColumn(name = "criteria_id")
    private TimecapsuleCriteria timecapsuleCriteria;

    public TimecapsuleInvite() {
    }

    public TimecapsuleInvite(Long inviteTcNo, Timecapsule timecapsule, Long guestUserNo, String status, LocalDateTime requestDate, TimecapsulePenalty timecapsulePenalty, TimecapsuleCriteria timecapsuleCriteria) {
        this.inviteTcNo = inviteTcNo;
        this.timecapsule = timecapsule;
        this.guestUserNo = guestUserNo;
        this.status = status;
        this.requestDate = requestDate;
        this.timecapsulePenalty = timecapsulePenalty;
        this.timecapsuleCriteria = timecapsuleCriteria;
    }

    public TimecapsuleInvite createTimecapsuleInvite(Timecapsule timecapsule, User user){
        this.timecapsule = timecapsule;
        this.guestUserNo = user.getUserNo();
        this.timecapsuleCriteria = timecapsule.getTimecapsuleCriteria();
        this.timecapsulePenalty = timecapsule.getTimecapsulePenalty();
        this.status = "ACCEPTED";
        this.requestDate = LocalDateTime.now();

        return this;
    }

    public TimecapsuleInvite friendTimecapsuleInvite(Timecapsule timecapsule, User user){
        this.timecapsule = timecapsule;
        this.guestUserNo = user.getUserNo();
        this.timecapsuleCriteria = timecapsule.getTimecapsuleCriteria();
        this.timecapsulePenalty = timecapsule.getTimecapsulePenalty();
        this.status = "NOTREAD";
        this.requestDate = LocalDateTime.now();

        return this;
    }

    public TimecapsuleInvite acceptTimecapsuleInvite(TimecapsuleInvite timecapsuleInvite){
        this.status = "ACCEPTED";
        this.requestDate = LocalDateTime.now();

        return this;
    }

    public void updateStatus(String status){
        this.status = status;
    }
}
