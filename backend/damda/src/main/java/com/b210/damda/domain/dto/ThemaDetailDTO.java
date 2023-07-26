package com.b210.damda.domain.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ThemaDetailDTO {

    private Long themaDetailsNo;
    private Long themaNo;
    private String path;
    private String type;

}
