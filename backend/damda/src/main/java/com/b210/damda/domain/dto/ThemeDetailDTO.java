package com.b210.damda.domain.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ThemeDetailDTO {

    private Long themeDetailsNo;
    private Long themeNo;
    private String path;
    private String type;

}
