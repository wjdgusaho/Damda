package com.b210.damda.domain.entity.Timecapsule;

import com.b210.damda.domain.dto.Timecapsule.CirteriaDayDTO;
import com.b210.damda.domain.entity.Timecapsule.TimecapsuleCriteria;
import com.b210.damda.domain.timecapsule.repository.CirteriaDayRepository;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Setter @Getter
public class CirteriaDay {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long dayNo;

    @ManyToOne
    @JoinColumn(name = "criteria_id")
    private TimecapsuleCriteria timecapsuleCriteria;

    private String dayKor;

    private String dayEn;

    public CirteriaDayDTO toCirteriaDayDTO(){
        return CirteriaDayDTO.builder()
                .dayKr(this.dayKor)
                .dayEn(this.dayEn)
                .build();

    }
}
