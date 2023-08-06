package com.b210.damda.domain.entity.Timecapsule;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Setter
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
}
