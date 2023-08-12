package com.b210.damda.domain.dto.Items;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ItemsMappingDTO {

    private long itemMappingNo;
    private long userNo;
    private long itemNo;

}
