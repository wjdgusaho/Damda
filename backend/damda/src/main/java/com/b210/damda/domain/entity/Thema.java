package com.b210.damda.domain.entity;

import com.b210.damda.domain.dto.ThemaShopDTO;
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
public class Thema {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long themaNo;
    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    private String description;
    @Column(nullable = false)
    private int price;
    @Column(nullable = false)
    private String icon;


    public ThemaShopDTO toThemaShopDTO(){
        return ThemaShopDTO.builder()
                .themaNo(this.themaNo)
                .name(this.name)
                .description(this.description)
                .price(this.price)
                .icon(this.icon)
                .build();
    }
}
