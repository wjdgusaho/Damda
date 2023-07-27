package com.b210.damda.domain.entity;

import com.b210.damda.domain.dto.ThemaDetailDTO;
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
public class ThemaDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long thema_details_no;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "thema_no")
    private Thema tema;

    @Column(nullable = false)
    private String path;

    @Column(nullable = false)
    private String type;


}
