package com.b210.damda.domain.dto;


import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Builder
@Getter @Setter
public class ThemeMappingDTO {

    private long themeMappingNo;
    private long userNo;
    private long temaNo;

}
