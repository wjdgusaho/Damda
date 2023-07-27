package com.b210.damda.domain.entity;

import com.b210.damda.domain.dto.ItemsMappingDTO;

import javax.persistence.*;

@Entity
public class ItemsMapping {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long itemMappingNo;

    @ManyToOne
    @JoinColumn(name = "user_no")
    private User user;

    @ManyToOne
    @JoinColumn(name = "item_no")
    private Items items;

    public ItemsMappingDTO tothemaMappingDTO(){
        return ItemsMappingDTO.builder()
                .itemMappingNo(this.itemMappingNo)
                .userNo(user.getUserNo())
                .itemNo(items.getItemNo())
                .build();
    }
}
