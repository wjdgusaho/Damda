package com.b210.damda.domain.entity;

import com.b210.damda.domain.dto.ItemsMappingDTO;
import com.b210.damda.domain.entity.User.User;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Setter
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

    public ItemsMappingDTO tothemeMappingDTO(){
        return ItemsMappingDTO.builder()
                .itemMappingNo(this.itemMappingNo)
                .userNo(user.getUserNo())
                .itemNo(items.getItemNo())
                .build();
    }
}
