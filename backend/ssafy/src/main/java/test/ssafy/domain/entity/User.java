package test.ssafy.domain.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;
import test.ssafy.domain.dto.UserRegistDTO;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
@Getter
@ToString
@Builder
public class User {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String password;
    private String email;
    private String nickname;
    private String registDate;

    public User() {
    }

    public User(Long id, String password, String email, String nickname, String registDate) {
        this.id = id;
        this.password = password;
        this.email = email;
        this.nickname = nickname;
        this.registDate = registDate;
    }
}
