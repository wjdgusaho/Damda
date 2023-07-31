package com.b210.damda.domain.dto;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Builder
@Getter @Setter
public class SaveCapsuleCriteriaDTO {

    private String type;
    private String weatherStatus;
    private String location;

}
