package com.b210.damda.domain.entity.theme;

import com.b210.damda.domain.dto.theme.ThemeShopDTO;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@ToString
public class Theme {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long themeNo;
    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    private String description;
    @Column(nullable = false)
    private int price;
    @Column(nullable = false)
    private String icon;


    public ThemeShopDTO toThemeShopDTO(){
        return ThemeShopDTO.builder()
                .themeNo(this.themeNo)
                .name(this.name)
                .description(this.description)
                .price(this.price)
                .icon(this.icon)
                .type("THEME")
                .build();
    }
}
