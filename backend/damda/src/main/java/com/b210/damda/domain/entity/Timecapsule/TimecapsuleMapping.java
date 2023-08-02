package com.b210.damda.domain.entity.Timecapsule;

import com.b210.damda.domain.entity.User;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Getter
@Setter
public class TimecapsuleMapping {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long timecapsuleMappingNo;

    @ManyToOne
    @JoinColumn(name = "timecapsule_no")
    private Timecapsule timecapsule;

    @ManyToOne
    @JoinColumn(name = "user_no")
    private User user;

    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean isSave;

    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean isHost;

    private Timestamp deleteDate;

    private Timestamp openDate;

    @Column(nullable = false, columnDefinition = "boolean default true")
    private boolean card_able;

    @Column(nullable = false, columnDefinition = "boolean default true")
    private boolean file_able;

}
