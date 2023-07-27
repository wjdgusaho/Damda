package com.b210.damda.domain.entity;

import com.b210.damda.domain.dto.ThemaMappingDTO;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;

import javax.persistence.*;

@Entity
@Getter
@Setter
public class ThemaMapping {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long themaMappingNo;

    @ManyToOne
    @JoinColumn(name = "user_no")
    private User user;

    @ManyToOne
    @JoinColumn(name = "thema_no")
    private Thema thema;

    public ThemaMappingDTO tothemaMappingDTO(){
        return ThemaMappingDTO.builder()
                .themaMappingNo(this.themaMappingNo)
                .userNo(user.getUserNo())
                .temaNo(thema.getThemaNo())
                .build();
    }
}
