package com.b210.damda.domain.entity;

import com.b210.damda.domain.dto.ItemsShopDTO;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;

@Entity
@Setter
@Getter
@NoArgsConstructor
@ToString
public class Items {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long itemNo;
    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    private String description;
    @Column(nullable = false)
    private int price;
    @Column(nullable = false)
    private String icon;

    @Column(nullable = false)
    private String type;

    public ItemsShopDTO toItemShopDTO(){
        return ItemsShopDTO.builder()
                .itemNo(this.itemNo)
                .name(this.name)
                .description(this.description)
                .price(this.price)
                .icon(this.icon)
                .type(this.type)
                .build();
    }

}
