package com.b210.damda.domain.entity;

import com.b210.damda.domain.dto.ThemaMappingDTO;
import lombok.Builder;

import javax.persistence.Entity;

import javax.persistence.*;

@Entity
public class ThemaMapping {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long themaMappingNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_no")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tema_no")
    private Thema thema;

    public ThemaMappingDTO tothemaMappingDTO(){
        return ThemaMappingDTO.builder()
                .themaMappingNo(this.themaMappingNo)
                .userNo(user.getUserNo())
                .temaNo(thema.getThemaNo())
                .build();
    }
}
