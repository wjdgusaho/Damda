package com.b210.damda.domain.dto;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ThemaMappingDTO {

    private long themaMappingNo;
    private long userNo;
    private long temaNo;

}
