package com.b210.damda.domain.entity.Items;

import lombok.Getter;

import javax.persistence.*;

@Entity
@Getter
public class ItemDetails {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long itemDetailsNo;

    @ManyToOne
    @JoinColumn(name="item_no")
    private Items items;

    private String path;

    public ItemDetails(){
    }
}
