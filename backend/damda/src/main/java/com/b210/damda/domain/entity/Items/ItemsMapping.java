package com.b210.damda.domain.entity.Items;

import com.b210.damda.domain.dto.Items.ItemsMappingDTO;
import com.b210.damda.domain.dto.Timecapsule.MyItemListDTO;
import com.b210.damda.domain.entity.User.User;
import lombok.Getter;
import lombok.ToString;

import javax.persistence.*;

@Entity
@Getter
@ToString
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

    public ItemsMapping() {
    }

    public ItemsMapping(User user, Items items) {
        this.user = user;
        this.items = items;
    }

    public ItemsMappingDTO tothemeMappingDTO(){
        return ItemsMappingDTO.builder()
                .itemMappingNo(this.itemMappingNo)
                .userNo(user.getUserNo())
                .itemNo(items.getItemNo())
                .build();
    }

    public MyItemListDTO toMyItemListDTO(){
        return MyItemListDTO.builder()
                .itemNo(this.items.getItemNo())
                .name(this.items.getName())
                .icon(this.items.getIcon())
                .build();
    }
}
