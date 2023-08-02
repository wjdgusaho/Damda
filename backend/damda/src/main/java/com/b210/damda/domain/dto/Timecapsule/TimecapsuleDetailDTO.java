package com.b210.damda.domain.dto.Timecapsule;

import com.b210.damda.domain.dto.Timecapsule.detailchild.DetailCriteria;
import com.b210.damda.domain.dto.Timecapsule.detailchild.DetailMyInfo;
import com.b210.damda.domain.dto.Timecapsule.detailchild.DetailPartInfo;
import com.b210.damda.domain.dto.Timecapsule.detailchild.DetailTimecapsule;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter @Setter
@Builder
public class TimecapsuleDetailDTO {

    private DetailTimecapsule timecapsuleInfo;
    private DetailCriteria criteriaInfo;
    private DetailMyInfo myInfo;
    private DetailPartInfo partInfo;

}
