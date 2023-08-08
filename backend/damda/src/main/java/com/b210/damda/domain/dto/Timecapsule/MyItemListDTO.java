package com.b210.damda.domain.dto.Timecapsule;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.Map;

@Data
@Getter @Setter
@Builder
@AllArgsConstructor
public class MyItemListDTO {
    @JsonProperty("no")
    private Long itemNo;
    private String name;
    private String icon;

    private Map<String, Object> sticker;

    public MyItemListDTO(){

    }
}
