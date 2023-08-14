package com.b210.damda.domain.entity.theme;

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
public class ThemeDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long theme_details_no;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "theme_no")
    private Theme tema;

    @Column(nullable = false)
    private String path;

    @Column(nullable = false)
    private String type;


}
