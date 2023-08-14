package com.b210.damda.domain.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter @Setter
@Builder
@AllArgsConstructor
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
