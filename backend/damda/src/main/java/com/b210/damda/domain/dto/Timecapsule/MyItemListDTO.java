package com.b210.damda.domain.dto.Timecapsule;

import lombok.*;

@Data
@Getter @Setter
@Builder
@AllArgsConstructor
public class MyItemListDTO {
    private Long itemNo;
    private String name;
    private String icon;

    public MyItemListDTO(){

    }
}
