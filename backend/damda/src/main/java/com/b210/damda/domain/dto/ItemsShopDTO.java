package com.b210.damda.domain.dto;

import com.b210.damda.domain.dto.Timecapsule.MyItemListDTO;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ItemsShopDTO {

    private long itemNo;
    private String name;
    private String description;
    private int price;
    private String icon;
    private boolean isUserHave;
    private String type;


}
