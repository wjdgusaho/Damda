package com.b210.damda.domain.entity;

import com.b210.damda.domain.dto.ThemeMappingDTO;
import com.b210.damda.domain.entity.User.User;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;

import javax.persistence.*;

@Entity
@Getter
@Setter
public class ThemeMapping {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long themeMappingNo;

    @ManyToOne
    @JoinColumn(name = "user_no")
    private User user;

    @ManyToOne
    @JoinColumn(name = "theme_no")
    private Theme theme;

    public ThemeMappingDTO tothemeMappingDTO(){
        return ThemeMappingDTO.builder()
                .themeMappingNo(this.themeMappingNo)
                .userNo(user.getUserNo())
                .temaNo(theme.getThemeNo())
                .build();
    }
}
