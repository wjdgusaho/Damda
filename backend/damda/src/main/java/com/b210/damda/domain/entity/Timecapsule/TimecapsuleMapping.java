package com.b210.damda.domain.entity.Timecapsule;

import com.b210.damda.domain.dto.Timecapsule.TimecapsuleOpenDetailDTO;
import com.b210.damda.domain.dto.Timecapsule.TimecapsuleOpenRankDTO;
import com.b210.damda.domain.dto.Timecapsule.detailchild.DetailMyInfoDTO;
import com.b210.damda.domain.dto.Timecapsule.detailchild.DetailPartInfoDTO;
import com.b210.damda.domain.entity.User.User;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Getter
@Setter
@ToString
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

    private Timestamp saveDate;

    @Column(nullable = false, columnDefinition = "boolean default true")
    private boolean cardAble = true;

    @Column(nullable = false, columnDefinition = "boolean default true")
    private boolean fileAble = true;

    public TimecapsuleMapping() {
    }

    public TimecapsuleMapping(Timecapsule timecapsule, User user) {
        this.timecapsule = timecapsule;
        this.user = user;
    }

    public DetailMyInfoDTO toDetailMyInfoDTO(){
        return DetailMyInfoDTO.builder()
                .userNo(this.user.getUserNo())
                .cardAble(this.cardAble)
                .fileAble(this.fileAble)
                .isHost(this.isHost)
                .build();
    }

    public DetailPartInfoDTO toDetailPartInfoDTO(){
        return DetailPartInfoDTO.builder()
                .userNo(this.user.getUserNo())
                .nickname(this.user.getNickname())
                .profileImage(this.user.getProfileImage())
                .build();
    }

    public TimecapsuleOpenRankDTO toTimecapsuleOpenRankDTO(){
        return TimecapsuleOpenRankDTO.builder()
                .userNo(this.user.getUserNo())
                .nickname(this.user.getNickname())
                .profileImage(this.user.getProfileImage())
                .build();
    }


}
