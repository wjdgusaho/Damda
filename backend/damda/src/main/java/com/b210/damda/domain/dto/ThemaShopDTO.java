package com.b210.damda.domain.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ThemaShopDTO {

    private long themaNo;
    private String name;
    private String description;
    private int price;
    private String icon;
    private boolean isUserHave;

    //private List<ThemaDetailDTO> items;

}
